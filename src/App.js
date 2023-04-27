import {Routes, Route,Navigate} from 'react-router-dom'
import {useState} from "react";
import Config from "./pages/ConfigPage";
import DJTool from "./pages/DjVjPage";
import DjVjPage from "./pages/DjVjPage";
import ConfigPage from "./pages/ConfigPage";

function App() {
    return (
        <div className='app'>
            <main>
                <Routes>
                    <Route path='/dj-vj-tool' element={<DjVjPage/>}/>
                    <Route path='/config' element={<ConfigPage/>}/>
                    <Route path='*' element={<Navigate to='/config'/>}/>
                </Routes>
            </main>
        </div>
    );
}

export default App;
