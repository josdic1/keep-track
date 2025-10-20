from flask import Blueprint, request, jsonify
from .extensions import db
from .models import Track, Artist, Link, Tag, Media
from .schemas import track_schema, tracks_schema, artist_schema, artists_schema, link_schema, links_schema, tag_schema, tags_schema, media_schema, medias_schema

api_bp = Blueprint('api', __name__)

# TRACK ROUTES
@api_bp.route('/tracks', methods=['GET'])
def get_tracks():
    items = Track.query.all()
    return jsonify(tracks_schema.dump(items))

@api_bp.route('/tracks/<int:id>', methods=['GET'])
def get_track(id):
    item = Track.query.get_or_404(id)
    return jsonify(track_schema.dump(item))

@api_bp.route('/tracks', methods=['POST'])
def create_track():
    data = request.get_json()
    required = ["name"]
    for field in required:
        if field not in data:
            return jsonify({'error': f'Missing: {field}'}), 400
    item = Track(**data)
    db.session.add(item)
    db.session.commit()
    return jsonify(track_schema.dump(item)), 201

@api_bp.route('/tracks/<int:id>', methods=['PUT'])
def update_track(id):
    item = Track.query.get_or_404(id)
    data = request.get_json()
    for key, value in data.items():
        setattr(item, key, value)
    db.session.commit()
    return jsonify(track_schema.dump(item))

@api_bp.route('/tracks/<int:id>', methods=['DELETE'])
def delete_track(id):
    item = Track.query.get_or_404(id)
    db.session.delete(item)
    db.session.commit()
    return '', 204

# ARTIST ROUTES
@api_bp.route('/artists', methods=['GET'])
def get_artists():
    items = Artist.query.all()
    return jsonify(artists_schema.dump(items))

@api_bp.route('/artists/<int:id>', methods=['GET'])
def get_artist(id):
    item = Artist.query.get_or_404(id)
    return jsonify(artist_schema.dump(item))

@api_bp.route('/artists', methods=['POST'])
def create_artist():
    data = request.get_json()
    required = ["name"]
    for field in required:
        if field not in data:
            return jsonify({'error': f'Missing: {field}'}), 400
    item = Artist(**data)
    db.session.add(item)
    db.session.commit()
    return jsonify(artist_schema.dump(item)), 201

@api_bp.route('/artists/<int:id>', methods=['PUT'])
def update_artist(id):
    item = Artist.query.get_or_404(id)
    data = request.get_json()
    for key, value in data.items():
        setattr(item, key, value)
    db.session.commit()
    return jsonify(artist_schema.dump(item))

@api_bp.route('/artists/<int:id>', methods=['DELETE'])
def delete_artist(id):
    item = Artist.query.get_or_404(id)
    db.session.delete(item)
    db.session.commit()
    return '', 204

# LINK ROUTES
@api_bp.route('/links', methods=['GET'])
def get_links():
    items = Link.query.all()
    return jsonify(links_schema.dump(items))

@api_bp.route('/links/<int:id>', methods=['GET'])
def get_link(id):
    item = Link.query.get_or_404(id)
    return jsonify(link_schema.dump(item))

@api_bp.route('/links', methods=['POST'])
def create_link():
    data = request.get_json()
    required = ["name","track_id"]
    for field in required:
        if field not in data:
            return jsonify({'error': f'Missing: {field}'}), 400
    item = Link(**data)
    db.session.add(item)
    db.session.commit()
    return jsonify(link_schema.dump(item)), 201

@api_bp.route('/links/<int:id>', methods=['PUT'])
def update_link(id):
    item = Link.query.get_or_404(id)
    data = request.get_json()
    for key, value in data.items():
        setattr(item, key, value)
    db.session.commit()
    return jsonify(link_schema.dump(item))

@api_bp.route('/links/<int:id>', methods=['DELETE'])
def delete_link(id):
    item = Link.query.get_or_404(id)
    db.session.delete(item)
    db.session.commit()
    return '', 204

# TAG ROUTES
@api_bp.route('/tags', methods=['GET'])
def get_tags():
    items = Tag.query.all()
    return jsonify(tags_schema.dump(items))

@api_bp.route('/tags/<int:id>', methods=['GET'])
def get_tag(id):
    item = Tag.query.get_or_404(id)
    return jsonify(tag_schema.dump(item))

@api_bp.route('/tags', methods=['POST'])
def create_tag():
    data = request.get_json()
    required = ["name"]
    for field in required:
        if field not in data:
            return jsonify({'error': f'Missing: {field}'}), 400
    item = Tag(**data)
    db.session.add(item)
    db.session.commit()
    return jsonify(tag_schema.dump(item)), 201

@api_bp.route('/tags/<int:id>', methods=['PUT'])
def update_tag(id):
    item = Tag.query.get_or_404(id)
    data = request.get_json()
    for key, value in data.items():
        setattr(item, key, value)
    db.session.commit()
    return jsonify(tag_schema.dump(item))

@api_bp.route('/tags/<int:id>', methods=['DELETE'])
def delete_tag(id):
    item = Tag.query.get_or_404(id)
    db.session.delete(item)
    db.session.commit()
    return '', 204

# MEDIA ROUTES
@api_bp.route('/medias', methods=['GET'])
def get_medias():
    items = Media.query.all()
    return jsonify(medias_schema.dump(items))

@api_bp.route('/medias/<int:id>', methods=['GET'])
def get_media(id):
    item = Media.query.get_or_404(id)
    return jsonify(media_schema.dump(item))

@api_bp.route('/medias', methods=['POST'])
def create_media():
    data = request.get_json()
    required = ["name"]
    for field in required:
        if field not in data:
            return jsonify({'error': f'Missing: {field}'}), 400
    item = Media(**data)
    db.session.add(item)
    db.session.commit()
    return jsonify(media_schema.dump(item)), 201

@api_bp.route('/medias/<int:id>', methods=['PUT'])
def update_media(id):
    item = Media.query.get_or_404(id)
    data = request.get_json()
    for key, value in data.items():
        setattr(item, key, value)
    db.session.commit()
    return jsonify(media_schema.dump(item))

@api_bp.route('/medias/<int:id>', methods=['DELETE'])
def delete_media(id):
    item = Media.query.get_or_404(id)
    db.session.delete(item)
    db.session.commit()
    return '', 204

@api_bp.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})
