export default function CanvasPicker() {
  const options = ["Foo", "Bar", "Baz"];
  return (
    <select>
      {options.map((option) => (
        <option key={option} value={option}>
          option
        </option>
      ))}
    </select>
  );
}
