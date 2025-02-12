import { Readable, pipeline } from "node:stream";
import { promisify } from "node:util";

export const pipelinePromise = promisify(pipeline);

export function streamToNodeReadable(webStream: ReadableStream<Uint8Array>) {
  const reader = webStream.getReader();
  
  return new Readable({
    async read(size) {
      const { done, value } = await reader.read();
      if (done) {
        this.push(null);
      } else {
        this.push(value);
      }
    }
  });
}