export function HorizontalLoader() {
  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-blue-500 z-50">
      <div className="h-1 bg-blue-300 animate-slide"></div>
    </div>
  );
}
