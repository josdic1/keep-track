from .extensions import db
from datetime import datetime, timezone

class Track(db.Model):
    __tablename__ = 'tracks'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    artists = db.relationship('Artist', back_populates='tracks')
    links = db.relationship('Link', back_populates='track', cascade='all, delete-orphan')
    tags = db.relationship('Tag', back_populates='tracks')

    def __repr__(self):
        return f'<Track {self.name}>'

class Artist(db.Model):
    __tablename__ = 'artists'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    tracks = db.relationship('Track', back_populates='artists')

    def __repr__(self):
        return f'<Artist {self.name}>'

class Link(db.Model):
    __tablename__ = 'links'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    track_id = db.Column(db.Integer, db.ForeignKey('tracks.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    track = db.relationship('Track', back_populates='links')

    def __repr__(self):
        return f'<Link {self.name}>'

class Tag(db.Model):
    __tablename__ = 'tags'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    tracks = db.relationship('Track', back_populates='tags')

    def __repr__(self):
        return f'<Tag {self.name}>'

class Media(db.Model):
    __tablename__ = 'medias'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    def __repr__(self):
        return f'<Media {self.name}>'

