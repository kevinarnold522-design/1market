export function onRequest(context) {
  return new Response("Hello from your new backend!", {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
