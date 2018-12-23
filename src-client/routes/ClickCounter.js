import { mapStatesToProps } from 'inferno-fluxible';
import { Button } from '_components';
import { increment, decrement } from '_mutations';

export default mapStatesToProps(props => {
  return (
    <>
      <p>Clicks {props.clickCount}</p>
      <Button onClick={increment}>Increment</Button>
      <Button onClick={decrement}>Decrement</Button>
    </>
  );
}, states => ({
  clickCount: states.clickCount
}));
