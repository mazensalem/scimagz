export function generateSignature(callback, paramsToSign) {
  fetch(`/api/cloudinary/signrequest`, {
    method: "POST",
    body: JSON.stringify({
      paramsToSign,
    }),
  })
    .then((r) => r.json())
    .then(({ signature }) => {
      callback(signature);
    });
}
