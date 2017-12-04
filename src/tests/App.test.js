// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from '../components/App';
// import renderer from 'react-test-renderer';
// import {shallow} from 'enzyme';


// it('renders without crashing', () => {
//     const div = document.createElement('div');
//     ReactDOM.render(<App />, div);
// });

// test('test snapshot', () => {
//     const appComponent = renderer.create(
//         <App/>
//     );
//     let tree = appComponent.toJSON();
//     expect(tree).toMatchSnapshot();
// });

// test('test content states', () => {
//     const appComponent = shallow(
//         <App/>
//     );
  
//     expect(appComponent.state().content).toEqual(0);
//     expect(appComponent.text()).toEqual('<Content />');

//     appComponent.instance().showImprint();
//     appComponent.update();
//     expect(appComponent.state().content).toEqual(1);
//     expect(appComponent.text()).toEqual('<Imprint />');

//     appComponent.instance().showContent();
//     appComponent.update();
//     expect(appComponent.state().content).toEqual(0);
//     expect(appComponent.text()).toEqual('<Content />');

// });