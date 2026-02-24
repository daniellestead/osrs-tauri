import { check, type Update } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';
import { useEffect, useState } from 'react';
import { getVersion } from '@tauri-apps/api/app';
import { Button } from '../../components/button'
import { Progress } from "@heroui/react";
import { ArrowPathIcon } from '@heroicons/react/24/outline'

type UpdateStatus = 'idle' | 'checking' | 'available' | 'up-to-date' | 'installing' | 'error';

export function UpdaterFooter() {
  const [status, setStatus] = useState<UpdateStatus>('idle');
  const [update, setUpdate] = useState<Update | null>(null);
  const [version, setVersion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [contentLength, setContentLength] = useState<number>(0);

  useEffect(() => {
    setStatus('idle');
    getVersion().then(setVersion);
  }, []);

  async function checkForUpdates() {
    setStatus('checking');
    setError(null);
    try {
      const result = await check();
      if (result) {
          setUpdate(result);
          setStatus('available');
      } else {
          setStatus('up-to-date');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to check for updates');
      setStatus('error');
    }
  }

  async function installUpdate() {
    if (!update) return;
    setStatus('installing');
    setError(null);
    setProgress(0);
    setContentLength(0);
    let downloaded = 0;
    try {
      await update.downloadAndInstall((event) => {
        switch (event.event) {
          case 'Started':
            setContentLength(event.data.contentLength ?? 0);
            break;
          case 'Progress':
            downloaded += event.data.chunkLength;
            setProgress(downloaded);
            break;
          case 'Finished':
            break;
        }
      });
      await relaunch();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to install update');
      setStatus('error');
    }
  }

  const progressPercent = contentLength > 0 ? Math.round((progress / contentLength) * 100) : 0;

  return (
    <div className="fixed bottom-0 right-0 flex items-center justify-end px-2 py-2 text-gray-600 text-xs gap-3">
      {version && <span>v{version}</span>}

      {status === 'up-to-date' && (
        <>
        <span>Up to date!</span>
        <Progress
						color="success"
						size="md"
						value={progressPercent}
						showValueLabel
						classNames={{
							label: "text-small",
						}}
					></Progress>
        </>
      )}

      {(status === 'idle' || status === 'checking' || status === 'up-to-date') && (
          <Button
            className="h-5 text-white bg-gray-500 hover:bg-gray-700"
            onPress={checkForUpdates}
            isLoading={status === 'checking'}
          >
            <ArrowPathIcon className="w-3 h-3" />
          </Button>
      )}

      {status === 'available' && update && (
        <>
          <span>Update {update.version} available</span>
          <Button
            onPress={installUpdate}
            className="h-5 text-white bg-gray-500 hover:bg-gray-700"
          >
            Install &amp; restart
          </Button>
        </>
      )}

      {status === 'error' && (
        <>
          <span className="text-red-500">{error}</span>
          <Button
            className="h-5 text-white bg-gray-500 hover:bg-gray-700"
            onPress={checkForUpdates}
          >
            Retry
          </Button>
        </>
      )}

      {status === 'installing' && (
        <>
          <span>
            {contentLength > 0
              ? `Downloading... ${progressPercent}%`
              : 'Installing...'}
          </span>
          <Progress
						color="success"
						size="md"
						value={progressPercent}
						showValueLabel
						classNames={{
							label: "text-small",
						}}
					></Progress>
        </>
      )}
    </div>
  );
}