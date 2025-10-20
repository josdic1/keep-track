import App from './App';
import ErrorPage from './pages/ErrorPage';
import HomePage from './pages/HomePage';
import FullSchemaGenerator from './components/layout/RelationshipGenerator';
import TrackPage from './pages/TrackPage';

const routes = [
    { 
        path: '/', 
        element: <App />, 
        errorElement: <ErrorPage />, 
        children: [
            { index: true, element: <FullSchemaGenerator /> },
            { path: 'tracks', element: <TrackPage /> },
            { path: '*', element: <ErrorPage /> }
        ]
    }
];

export default routes;