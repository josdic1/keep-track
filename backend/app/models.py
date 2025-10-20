from .extensions import db
from datetime import datetime, timezone

# Association table for many-to-many relationship between Track and Tag
track_tags = db.Table('track_tags',
    db.Column('track_id', db.Integer, db.ForeignKey('tracks.id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('tags.id'), primary_key=True),
    db.Column('created_at', db.DateTime, default=lambda: datetime.now(timezone.utc))
)


class Track(db.Model):
    __tablename__ = 'tracks'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    artist_id = db.Column(db.Integer, db.ForeignKey('artists.id'))
    status = db.Column(db.String(50), nullable=False, default='idea')
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Relationships
    artist = db.relationship('Artist', back_populates='tracks')
    links = db.relationship('Link', back_populates='track', cascade='all, delete-orphan')
    tags = db.relationship('Tag', secondary=track_tags, back_populates='tracks')
    status_history = db.relationship('StatusHistory', back_populates='track', cascade='all, delete-orphan')
    media_files = db.relationship('Media', back_populates='track', cascade='all, delete-orphan')
    
    def to_dict(self, include_relations=True):
        data = {
            'id': self.id,
            'name': self.name,
            'artist_id': self.artist_id,
            'artist': self.artist.name if self.artist else None,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
        
        if include_relations:
            data['tags'] = [{'id': tag.id, 'name': tag.name} for tag in self.tags]
            data['links'] = [link.to_dict() for link in self.links]
        
        return data
    
    def __repr__(self):
        return f'<Track {self.name}>'


class Artist(db.Model):
    __tablename__ = 'artists'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Relationships
    tracks = db.relationship('Track', back_populates='artist')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def __repr__(self):
        return f'<Artist {self.name}>'


class Link(db.Model):
    __tablename__ = 'links'
    
    id = db.Column(db.Integer, primary_key=True)
    track_id = db.Column(db.Integer, db.ForeignKey('tracks.id'), nullable=False)
    link_type = db.Column(db.String(50), nullable=False)  # spotify, youtube, soundcloud, drive, etc.
    link_url = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Relationships
    track = db.relationship('Track', back_populates='links')
    
    def to_dict(self):
        return {
            'id': self.id,
            'track_id': self.track_id,
            'link_type': self.link_type,
            'link_url': self.link_url,
            'description': self.description,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def __repr__(self):
        return f'<Link {self.link_type}: {self.link_url}>'


class Tag(db.Model):
    __tablename__ = 'tags'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Relationships
    tracks = db.relationship('Track', secondary=track_tags, back_populates='tags')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def __repr__(self):
        return f'<Tag {self.name}>'


class StatusHistory(db.Model):
    __tablename__ = 'status_history'
    
    id = db.Column(db.Integer, primary_key=True)
    track_id = db.Column(db.Integer, db.ForeignKey('tracks.id'), nullable=False)
    old_status = db.Column(db.String(50))
    new_status = db.Column(db.String(50), nullable=False)
    notes = db.Column(db.Text)
    changed_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    
    # Relationships
    track = db.relationship('Track', back_populates='status_history')
    
    def to_dict(self):
        return {
            'id': self.id,
            'track_id': self.track_id,
            'old_status': self.old_status,
            'new_status': self.new_status,
            'notes': self.notes,
            'changed_at': self.changed_at.isoformat()
        }
    
    def __repr__(self):
        return f'<StatusHistory {self.old_status} -> {self.new_status}>'


class Media(db.Model):
    __tablename__ = 'medias'
    
    id = db.Column(db.Integer, primary_key=True)
    track_id = db.Column(db.Integer, db.ForeignKey('tracks.id'))
    name = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(500))
    file_type = db.Column(db.String(50))  # audio, image, video, document
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Relationships
    track = db.relationship('Track', back_populates='media_files')
    
    def to_dict(self):
        return {
            'id': self.id,
            'track_id': self.track_id,
            'name': self.name,
            'file_path': self.file_path,
            'file_type': self.file_type,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def __repr__(self):
        return f'<Media {self.name}>'