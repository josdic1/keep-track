

function TrackItem({ track }) {

const onClick = (e) => {
   const { name } = e.target;
   switch(name) {
 case 'view':
      console.log('View clicked');
      break;
    case 'edit':
      console.log('Edit clicked');
      break;
case 'delete':
      console.log('Delete clicked');
      break;
    case 'links':
      console.log('Links clicked');
      break;
    case 'tags':
      console.log('Tags clicked');
      break;
    default: break;
   }
}

return (
<>
        <tr id={track.id}>
            <td>{track.name}</td>
            <td>{track.status}</td>
            <td>{track.artist_id}</td>
            <td>{track.links.length > 0 ? 
                <button type='button' name='links' onClick={onClick}>{`${track.links.length} Links`}</button> : 'n/a'}</td>
            <td>{track.tags.length > 0 ? 
                <button type='button' name='tags' onClick={onClick}>{`${track.tags.length} Tags`}</button> : 'n/a'}</td>
            <td>
                <button type='button' name='view' onClick={onClick}>View</button>
                <button type='button' name='edit' onClick={onClick}>Edit</button>
                <button type='button' name='delete' onClick={onClick}>Delete</button>
            </td>
            <td>{track.created_at}</td>
            <td>{track.update_at}</td>
        </tr>
            
</>
)}

export default TrackItem
