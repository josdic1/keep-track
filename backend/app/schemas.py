from .extensions import ma
from .models import Track, Artist, Link, Tag, Media

class TrackSchema(ma.SQLAlchemyAutoSchema):
    artists = ma.Nested('ArtistSchema', many=true, exclude=('tracks',))
    links = ma.Nested('LinkSchema', many=true, exclude=('track',))
    tags = ma.Nested('TagSchema', many=true, exclude=('tracks',))

    class Meta:
        model = Track
        load_instance = True
        include_fk = True

track_schema = TrackSchema()
tracks_schema = TrackSchema(many=True)

class ArtistSchema(ma.SQLAlchemyAutoSchema):
    tracks = ma.Nested('TrackSchema', many=true, exclude=('artists',))

    class Meta:
        model = Artist
        load_instance = True
        include_fk = True

artist_schema = ArtistSchema()
artists_schema = ArtistSchema(many=True)

class LinkSchema(ma.SQLAlchemyAutoSchema):
    track = ma.Nested('TrackSchema', many=false, exclude=('links',))

    class Meta:
        model = Link
        load_instance = True
        include_fk = True

link_schema = LinkSchema()
links_schema = LinkSchema(many=True)

class TagSchema(ma.SQLAlchemyAutoSchema):
    tracks = ma.Nested('TrackSchema', many=true, exclude=('tags',))

    class Meta:
        model = Tag
        load_instance = True
        include_fk = True

tag_schema = TagSchema()
tags_schema = TagSchema(many=True)

class MediaSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Media
        load_instance = True
        include_fk = True

media_schema = MediaSchema()
medias_schema = MediaSchema(many=True)

