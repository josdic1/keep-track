import { useContext } from "react"
import TrackContext from "../../contexts/TrackContext"
import TrackItem from "./TrackItem";



function TracksList() {
    const { tracks, loading, error } = useContext(TrackContext)


return (
<>
<table>
    <thead>
        <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Status</th>
            <th>Artist.ID</th>
            <th>Links</th>
            <th>Tags</th>
            <th>Actions</th>
            <th>Created</th>
            <th>Modified</th>
        </tr>
    </thead>
    <tbody>
        {tracks.map(track => (
            <TrackItem
                key={track.id} track={track}
            />
        ))}
    </tbody>
</table>
</>
)}

export default TracksList
