import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import renderer from 'react-test-renderer';
import AddCar from './components/AddCar'

/*
  this test file creates a 'div' element to the DOM and mounts the App component to it
  Finally, the component is unmounted from div
 */
it('renders without creashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />,div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders a snapshot', () => {
  const tree = renderer.create(<AddCar />).toJSON();
  expect(tree).toMatchSnapshot();
});



/*import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});*/
