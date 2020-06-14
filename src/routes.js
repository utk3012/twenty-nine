import Home from './components/Home';
import Create from './components/Create';
import Join from './components/Join';
import Play from './components/Play';
import Stats from './components/Stats'

export const routes = [
    { path: '/', component: Home },
    { path: '/create', component: Create },
    { path: '/join', component: Join },
    { path: '/play/:id', component: Play },
    { path: '/stats', component: Stats },
];