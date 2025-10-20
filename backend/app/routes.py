from flask import Blueprint, request, jsonify
from .extensions import db
from .models import Track, Artist, Link, Tag, Media, StatusHistory
from .schemas import (
    track_schema, tracks_schema, tracks_simple_schema,
    artist_schema, artists_schema,
    link_schema, links_schema,
    tag_schema, tags_schema,
    media_schema, medias_schema,
    status_history_schema, status_histories_schema
)

api_bp = Blueprint('api', __name__)


# ============= TRACK ROUTES =============

@api_bp.route('/tracks', methods=['GET'])
def get_tracks():
    """Get all tracks with optional filtering and search"""
    status = request.args.get('status')
    artist_name = request.args.get('artist')
    tag_name = request.args.get('tag')
    search = request.args.get('search')
    simple = request.args.get('simple', 'false').lower() == 'true'
    
    query = Track.query
    
    # Filter by status
    if status:
        query = query.filter_by(status=status)
    
    # Filter by artist name
    if artist_name:
        query = query.join(Artist).filter(Artist.name.ilike(f'%{artist_name}%'))
    
    # Filter by tag
    if tag_name:
        query = query.join(Track.tags).filter(Tag.name == tag_name)
    
    # Search in track name or artist name
    if search:
        query = query.outerjoin(Artist).filter(
            db.or_(
                Track.name.ilike(f'%{search}%'),
                Artist.name.ilike(f'%{search}%')
            )
        )
    
    tracks = query.order_by(Track.updated_at.desc()).all()
    
    # Use simple schema for lists (faster, less data)
    if simple:
        return jsonify(tracks_simple_schema.dump(tracks))
    return jsonify(tracks_schema.dump(tracks))


@api_bp.route('/tracks/<int:id>', methods=['GET'])
def get_track(id):
    """Get a single track with all relationships"""
    track = Track.query.get_or_404(id)
    return jsonify(track_schema.dump(track))


@api_bp.route('/tracks', methods=['POST'])
def create_track():
    """Create a new track with optional artist, tags, and links"""
    data = request.get_json()
    
    if not data.get('name'):
        return jsonify({'error': 'Track name is required'}), 400
    
    # Handle artist (create if doesn't exist, or link existing)
    artist = None
    if data.get('artist_name'):
        artist = Artist.query.filter_by(name=data['artist_name']).first()
        if not artist:
            artist = Artist(name=data['artist_name'])
            db.session.add(artist)
            db.session.flush()
    
    # Create track
    track = Track(
        name=data['name'],
        artist_id=artist.id if artist else data.get('artist_id'),
        status=data.get('status', 'idea')
    )
    db.session.add(track)
    db.session.flush()
    
    # Create initial status history
    history = StatusHistory(
        track_id=track.id,
        old_status=None,
        new_status=track.status,
        notes='Track created'
    )
    db.session.add(history)
    
    # Add tags (create if don't exist, or link existing)
    if data.get('tags'):
        for tag_name in data['tags']:
            tag = Tag.query.filter_by(name=tag_name).first()
            if not tag:
                tag = Tag(name=tag_name)
                db.session.add(tag)
                db.session.flush()
            track.tags.append(tag)
    
    # Add links
    if data.get('links'):
        for link_data in data['links']:
            if link_data.get('link_type') and link_data.get('link_url'):
                link = Link(
                    track_id=track.id,
                    link_type=link_data['link_type'],
                    link_url=link_data['link_url'],
                    description=link_data.get('description')
                )
                db.session.add(link)
    
    db.session.commit()
    return jsonify(track_schema.dump(track)), 201


@api_bp.route('/tracks/<int:id>', methods=['PUT'])
def update_track(id):
    """Update a track (tracks status changes)"""
    track = Track.query.get_or_404(id)
    data = request.get_json()
    
    old_status = track.status
    
    # Update basic fields
    if 'name' in data:
        track.name = data['name']
    
    # Update artist
    if 'artist_name' in data:
        artist = Artist.query.filter_by(name=data['artist_name']).first()
        if not artist:
            artist = Artist(name=data['artist_name'])
            db.session.add(artist)
            db.session.flush()
        track.artist_id = artist.id
    elif 'artist_id' in data:
        track.artist_id = data['artist_id']
    
    # Track status changes
    if 'status' in data and data['status'] != old_status:
        track.status = data['status']
        history = StatusHistory(
            track_id=track.id,
            old_status=old_status,
            new_status=data['status'],
            notes=data.get('status_notes')
        )
        db.session.add(history)
    
    db.session.commit()
    return jsonify(track_schema.dump(track))


@api_bp.route('/tracks/<int:id>', methods=['DELETE'])
def delete_track(id):
    """Delete a track (cascades to links, status history, tags)"""
    track = Track.query.get_or_404(id)
    db.session.delete(track)
    db.session.commit()
    return '', 204


@api_bp.route('/tracks/<int:id>/history', methods=['GET'])
def get_track_history(id):
    """Get status history for a track"""
    track = Track.query.get_or_404(id)
    return jsonify(status_histories_schema.dump(track.status_history))


# ============= TAG MANAGEMENT ROUTES =============

@api_bp.route('/tracks/<int:track_id>/tags', methods=['POST'])
def add_tag_to_track(track_id):
    """Add a tag to a track (creates tag if it doesn't exist)"""
    track = Track.query.get_or_404(track_id)
    data = request.get_json()
    
    tag_name = data.get('tag_name') or data.get('name')
    if not tag_name:
        return jsonify({'error': 'tag_name is required'}), 400
    
    # Find or create tag
    tag = Tag.query.filter_by(name=tag_name).first()
    if not tag:
        tag = Tag(name=tag_name)
        db.session.add(tag)
        db.session.flush()
    
    # Check if already associated
    if tag in track.tags:
        return jsonify({'error': 'Tag already added to track'}), 409
    
    track.tags.append(tag)
    db.session.commit()
    
    return jsonify({'message': 'Tag added to track', 'tag': tag_schema.dump(tag)}), 201


@api_bp.route('/tracks/<int:track_id>/tags/<int:tag_id>', methods=['DELETE'])
def remove_tag_from_track(track_id, tag_id):
    """Remove a tag from a track"""
    track = Track.query.get_or_404(track_id)
    tag = Tag.query.get_or_404(tag_id)
    
    if tag not in track.tags:
        return jsonify({'error': 'Tag not associated with track'}), 404
    
    track.tags.remove(tag)
    db.session.commit()
    
    return jsonify({'message': 'Tag removed from track'}), 200


# ============= LINK ROUTES (nested under tracks) =============

@api_bp.route('/tracks/<int:track_id>/links', methods=['POST'])
def add_link(track_id):
    """Add a link to a track"""
    track = Track.query.get_or_404(track_id)
    data = request.get_json()
    
    required = ['link_type', 'link_url']
    for field in required:
        if field not in data:
            return jsonify({'error': f'Missing: {field}'}), 400
    
    link = Link(
        track_id=track_id,
        link_type=data['link_type'],
        link_url=data['link_url'],
        description=data.get('description')
    )
    
    db.session.add(link)
    db.session.commit()
    
    return jsonify(link_schema.dump(link)), 201


@api_bp.route('/tracks/<int:track_id>/links/<int:link_id>', methods=['PUT'])
def update_link(track_id, link_id):
    """Update a link"""
    track = Track.query.get_or_404(track_id)
    link = Link.query.filter_by(id=link_id, track_id=track_id).first_or_404()
    
    data = request.get_json()
    
    if 'link_type' in data:
        link.link_type = data['link_type']
    if 'link_url' in data:
        link.link_url = data['link_url']
    if 'description' in data:
        link.description = data['description']
    
    db.session.commit()
    return jsonify(link_schema.dump(link))


@api_bp.route('/tracks/<int:track_id>/links/<int:link_id>', methods=['DELETE'])
def delete_link(track_id, link_id):
    """Delete a link"""
    track = Track.query.get_or_404(track_id)
    link = Link.query.filter_by(id=link_id, track_id=track_id).first_or_404()
    
    db.session.delete(link)
    db.session.commit()
    
    return '', 204

# ============= ALL LINKS ROUTES =============
@api_bp.route('/links', methods=['GET'])
def get_all_links():
    """Get all links across all tracks"""
    links = Link.query.all()
    return jsonify(links_schema.dump(links))


@api_bp.route('/links/<int:id>', methods=['GET'])
def get_single_link(id):
    """Get a single link by ID"""
    link = Link.query.get_or_404(id)
    return jsonify(link_schema.dump(link))

# ============= ARTIST ROUTES =============

@api_bp.route('/artists', methods=['GET'])
def get_artists():
    """Get all artists"""
    artists = Artist.query.order_by(Artist.name).all()
    return jsonify(artists_schema.dump(artists))


@api_bp.route('/artists/<int:id>', methods=['GET'])
def get_artist(id):
    """Get a single artist with their tracks"""
    artist = Artist.query.get_or_404(id)
    return jsonify(artist_schema.dump(artist))


@api_bp.route('/artists', methods=['POST'])
def create_artist():
    """Create a new artist"""
    data = request.get_json()
    
    if not data.get('name'):
        return jsonify({'error': 'Artist name is required'}), 400
    
    # Check if artist already exists
    existing = Artist.query.filter_by(name=data['name']).first()
    if existing:
        return jsonify({'error': 'Artist already exists', 'artist': artist_schema.dump(existing)}), 409
    
    artist = Artist(name=data['name'])
    db.session.add(artist)
    db.session.commit()
    
    return jsonify(artist_schema.dump(artist)), 201


@api_bp.route('/artists/<int:id>', methods=['PUT'])
def update_artist(id):
    """Update an artist"""
    artist = Artist.query.get_or_404(id)
    data = request.get_json()
    
    if 'name' in data:
        # Check if new name already exists
        existing = Artist.query.filter_by(name=data['name']).first()
        if existing and existing.id != id:
            return jsonify({'error': 'Artist name already exists'}), 409
        artist.name = data['name']
    
    db.session.commit()
    return jsonify(artist_schema.dump(artist))


@api_bp.route('/artists/<int:id>', methods=['DELETE'])
def delete_artist(id):
    """Delete an artist (sets tracks' artist_id to NULL)"""
    artist = Artist.query.get_or_404(id)
    db.session.delete(artist)
    db.session.commit()
    return '', 204


# ============= TAG ROUTES =============

@api_bp.route('/tags', methods=['GET'])
def get_tags():
    """Get all tags"""
    tags = Tag.query.order_by(Tag.name).all()
    return jsonify(tags_schema.dump(tags))


@api_bp.route('/tags/<int:id>', methods=['GET'])
def get_tag(id):
    """Get a single tag with tracks using it"""
    tag = Tag.query.get_or_404(id)
    return jsonify(tag_schema.dump(tag))


@api_bp.route('/tags', methods=['POST'])
def create_tag():
    """Create a new tag"""
    data = request.get_json()
    
    if not data.get('name'):
        return jsonify({'error': 'Tag name is required'}), 400
    
    # Check if tag already exists
    existing = Tag.query.filter_by(name=data['name']).first()
    if existing:
        return jsonify({'error': 'Tag already exists', 'tag': tag_schema.dump(existing)}), 409
    
    tag = Tag(name=data['name'])
    db.session.add(tag)
    db.session.commit()
    
    return jsonify(tag_schema.dump(tag)), 201


@api_bp.route('/tags/<int:id>', methods=['PUT'])
def update_tag(id):
    """Update a tag"""
    tag = Tag.query.get_or_404(id)
    data = request.get_json()
    
    if 'name' in data:
        # Check if new name already exists
        existing = Tag.query.filter_by(name=data['name']).first()
        if existing and existing.id != id:
            return jsonify({'error': 'Tag name already exists'}), 409
        tag.name = data['name']
    
    db.session.commit()
    return jsonify(tag_schema.dump(tag))


@api_bp.route('/tags/<int:id>', methods=['DELETE'])
def delete_tag(id):
    """Delete a tag (removes from all tracks)"""
    tag = Tag.query.get_or_404(id)
    db.session.delete(tag)
    db.session.commit()
    return '', 204


# ============= MEDIA ROUTES =============

@api_bp.route('/medias', methods=['GET'])
def get_medias():
    """Get all media files"""
    items = Media.query.all()
    return jsonify(medias_schema.dump(items))


@api_bp.route('/medias/<int:id>', methods=['GET'])
def get_media(id):
    """Get a single media file"""
    item = Media.query.get_or_404(id)
    return jsonify(media_schema.dump(item))


@api_bp.route('/tracks/<int:track_id>/media', methods=['POST'])
def create_media(track_id):
    """Add media file to a track"""
    track = Track.query.get_or_404(track_id)
    data = request.get_json()
    
    if not data.get('name'):
        return jsonify({'error': 'Media name is required'}), 400
    
    media = Media(
        track_id=track_id,
        name=data['name'],
        file_path=data.get('file_path'),
        file_type=data.get('file_type')
    )
    db.session.add(media)
    db.session.commit()
    
    return jsonify(media_schema.dump(media)), 201


@api_bp.route('/medias/<int:id>', methods=['PUT'])
def update_media(id):
    """Update a media file"""
    media = Media.query.get_or_404(id)
    data = request.get_json()
    
    if 'name' in data:
        media.name = data['name']
    if 'file_path' in data:
        media.file_path = data['file_path']
    if 'file_type' in data:
        media.file_type = data['file_type']
    
    db.session.commit()
    return jsonify(media_schema.dump(media))


@api_bp.route('/medias/<int:id>', methods=['DELETE'])
def delete_media(id):
    """Delete a media file"""
    media = Media.query.get_or_404(id)
    db.session.delete(media)
    db.session.commit()
    return '', 204


# ============= UTILITY ROUTES =============

@api_bp.route('/search', methods=['GET'])
def search_tracks():
    """Advanced search across tracks"""
    q = request.args.get('q', '')
    status = request.args.get('status')
    tag = request.args.get('tag')
    artist = request.args.get('artist')
    sort_by = request.args.get('sort_by', 'updated_at')
    sort_order = request.args.get('sort_order', 'desc')
    
    query = Track.query
    
    # Text search in track name
    if q:
        query = query.outerjoin(Artist).filter(
            db.or_(
                Track.name.ilike(f'%{q}%'),
                Artist.name.ilike(f'%{q}%')
            )
        )
    
    # Filter by status
    if status:
        query = query.filter_by(status=status)
    
    # Filter by artist
    if artist:
        query = query.join(Artist).filter(Artist.name.ilike(f'%{artist}%'))
    
    # Filter by tag
    if tag:
        query = query.join(Track.tags).filter(Tag.name == tag)
    
    # Sort
    sort_column = getattr(Track, sort_by, Track.updated_at)
    if sort_order == 'desc':
        query = query.order_by(sort_column.desc())
    else:
        query = query.order_by(sort_column.asc())
    
    tracks = query.all()
    return jsonify(tracks_simple_schema.dump(tracks))


@api_bp.route('/stats', methods=['GET'])
def get_stats():
    """Get overall statistics"""
    total_tracks = Track.query.count()
    total_artists = Artist.query.count()
    total_tags = Tag.query.count()
    
    # Count by status
    status_counts = db.session.query(
        Track.status, 
        db.func.count(Track.id)
    ).group_by(Track.status).all()
    
    return jsonify({
        'total_tracks': total_tracks,
        'total_artists': total_artists,
        'total_tags': total_tags,
        'tracks_by_status': {status: count for status, count in status_counts}
    })


@api_bp.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'service': 'keep-track-api'})