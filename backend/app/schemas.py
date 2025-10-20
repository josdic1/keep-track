from .extensions import ma
from .models import Track, Artist, Link, Tag, Media, StatusHistory

class ArtistSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Artist
        load_instance = True
        include_fk = True

artist_schema = ArtistSchema()
artists_schema = ArtistSchema(many=True)


class TagSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Tag
        load_instance = True

tag_schema = TagSchema()
tags_schema = TagSchema(many=True)


class LinkSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Link
        load_instance = True
        include_fk = True

link_schema = LinkSchema()
links_schema = LinkSchema(many=True)


class StatusHistorySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = StatusHistory
        load_instance = True
        include_fk = True

status_history_schema = StatusHistorySchema()
status_histories_schema = StatusHistorySchema(many=True)


class MediaSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Media
        load_instance = True
        include_fk = True

media_schema = MediaSchema()
medias_schema = MediaSchema(many=True)


class TrackSchema(ma.SQLAlchemyAutoSchema):
    artist = ma.Nested(ArtistSchema, exclude=('tracks',))
    tags = ma.Nested(TagSchema, many=True, exclude=('tracks',))
    links = ma.Nested(LinkSchema, many=True, exclude=('track',))
    status_history = ma.Nested(StatusHistorySchema, many=True, exclude=('track',))
    media_files = ma.Nested(MediaSchema, many=True, exclude=('track',))

    class Meta:
        model = Track
        load_instance = True
        include_fk = True

track_schema = TrackSchema()
tracks_schema = TrackSchema(many=True)


# Simple schemas without nested relationships (for listings)
class TrackSimpleSchema(ma.SQLAlchemyAutoSchema):
    artist_name = ma.Function(lambda obj: obj.artist.name if obj.artist else None)
    tag_names = ma.Function(lambda obj: [tag.name for tag in obj.tags])
    
    class Meta:
        model = Track
        load_instance = True
        include_fk = True
        exclude = ('artist', 'tags', 'links', 'status_history', 'media_files')

track_simple_schema = TrackSimpleSchema()
tracks_simple_schema = TrackSimpleSchema(many=True)