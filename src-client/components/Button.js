export default props => (
  <button
    id={props.id}
    className={props.className}
    onClick={props.onClick}>
    {props.children}
  </button>
);
