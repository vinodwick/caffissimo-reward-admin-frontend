import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const qrcodeRegionId = "html5qr-code-full-region";

function QRScanner({ onScanSuccess, onScanFailure }) {
  const successRef = useRef(onScanSuccess);
  const failureRef = useRef(onScanFailure);

  useEffect(() => {
    successRef.current = onScanSuccess;
    failureRef.current = onScanFailure;
  }, [onScanSuccess, onScanFailure]);

  useEffect(() => {
    let html5QrcodeScanner;

    const timer = setTimeout(() => {
      const config = { fps: 10, qrbox: { width: 250, height: 250 } };
      html5QrcodeScanner = new Html5QrcodeScanner(qrcodeRegionId, config, false);
      
      html5QrcodeScanner.render(
        (decodedText, decodedResult) => {
          if (successRef.current) successRef.current(decodedText, decodedResult);
        },
        (errorMessage) => {
          if (failureRef.current) failureRef.current(errorMessage);
        }
      );
    }, 50);

    return () => {
      clearTimeout(timer);
      if (html5QrcodeScanner) {
        html5QrcodeScanner.clear().catch(error => {
          console.error("Failed to clear html5QrcodeScanner. ", error);
        });
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full pb-4">
      <style>
        {`
          #${qrcodeRegionId} {
            border: none !important;
            padding: 0 !important;
            width: 100% !important;
          }
          #${qrcodeRegionId} button {
            background-color: var(--primary) !important;
            color: white !important;
            padding: 10px 20px !important;
            border-radius: 8px !important;
            border: none !important;
            margin: 10px 5px !important;
            cursor: pointer !important;
            font-weight: 500 !important;
            font-size: 14px !important;
            min-height: 44px !important; /* Mobile touch target size */
          }
          #${qrcodeRegionId} a {
            color: var(--secondary) !important;
            text-decoration: underline !important;
            padding: 10px !important;
            display: inline-block !important;
            min-height: 44px !important;
          }
          #${qrcodeRegionId} select {
            padding: 10px !important;
            border-radius: 8px !important;
            border: 1px solid #e2e8f0 !important;
            margin-bottom: 15px !important;
            width: 100% !important;
            max-width: 300px !important;
          }
          #${qrcodeRegionId} img {
            display: none !important; /* Hides the default info icon that breaks layout */
          }
        `}
      </style>
      
      <div className="mb-4 mt-2 text-[#6F4E37] opacity-90">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
      </div>

      <div id={qrcodeRegionId} style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }} />
    </div>
  );
}

export default QRScanner;
