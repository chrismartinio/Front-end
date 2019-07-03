import 'react-native';
import React from 'react';
import App from '../App';
import renderer from 'react-test-renderer';
import NavigationTestUtils from 'react-navigation/NavigationTestUtils';

// describe('App snapshot', () => {
//   jest.useFakeTimers();
//   beforeEach(() => {
//     NavigationTestUtils.resetInternalState();
//   });

//   it('renders the loading screen', async () => {
//     const tree = renderer.create(<App />).toJSON();
//     expect(tree).toMatchSnapshot();
//   });

//   it('renders the root without loading screen', async () => {
//     const tree = renderer.create(<App skipLoadingScreen />).toJSON();
//     expect(tree).toMatchSnapshot();
//   });
// });

describe('<App />', () => {
  it(' 1 child', () => {
    const tree = renderer.create(<App />).toJSON();
    expect(tree.children.length).toBe(1);
  });
});


it('App renders without crashing', () => {
const rendered = renderer.create(<App />).toJSON();
expect(rendered).toBeTruthy();
});

it('App test against snapshot', () => {
const tree = renderer.create(<App />).toJSON();
expect(tree).toMatchSnapshot();
});