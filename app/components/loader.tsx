type LoaderProps = {
  text?: string;
}

export function Loader({ text }: LoaderProps) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
      {text && <p className="mt-4 text-lg text-gray-700">{text}</p>}
    </div>
  );
}
