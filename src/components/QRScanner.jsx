import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const qrcodeRegionId = "html5qr-code-full-region";

function QRScanner({ onScanSuccess, onScanFailure }) {
  const scannerRef = useRef(null);

  useEffect(() => {
    // Start scanning
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };
    const html5QrcodeScanner = new Html5QrcodeScanner(qrcodeRegionId, config, false);
    
    html5QrcodeScanner.render(
      (decodedText, decodedResult) => {
        if (onScanSuccess) {
          onScanSuccess(decodedText, decodedResult);
        }
      },
      (errorMessage) => {
        if (onScanFailure) {
          onScanFailure(errorMessage);
        }
      }
    );

    // Cleanup on unmount
    return () => {
      html5QrcodeScanner.clear().catch(error => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
    };
  }, [onScanSuccess, onScanFailure]);

  return (
    <div id={qrcodeRegionId} style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }} />
  );
}

export default QRScanner;
