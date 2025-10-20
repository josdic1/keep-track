import { NavLink } from "react-router-dom"

function NavBar() {

return (
<>
<nav className="bg-blue-600 text-white p-4">

    <NavLink to="/">Home</NavLink>
     <NavLink to="tracks">Tracks</NavLink>
</nav>
</>
)}

export default NavBar
