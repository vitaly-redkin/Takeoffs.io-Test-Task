import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppHeader from '../app-header/AppHeader';
import Routes from '../routes/Routes';

import './App.css';

class App extends React.Component {
  public render() {
    return (
      <BrowserRouter>
        <div>
          <div className='app-header-contaner'>
            <AppHeader />
          </div>
          <div>
            <Routes />
          </div>
        </div>
        </BrowserRouter>
    );
  }
}

export default App;
