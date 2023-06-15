import React from 'react';
import {Provider} from 'react-redux';
import {store} from './src/stores/stores';
import {MapsScreen} from './src/features/maps/MapsScreen';

const App = () => {
  return (
    <Provider store={store}>
      <MapsScreen />
    </Provider>
  );
};

export default App;
