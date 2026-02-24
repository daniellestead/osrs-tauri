import { check, type Update } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';
import { useEffect, useState } from 'react';
import { getVersion } from '@tauri-apps/api/app';
import { Button } from '../../components/button'
import { ArrowPathIcon } from '@heroicons/react/24/outline'

type UpdateStatus = 'idle' | 'checking' | 'available' | 'up-to-date' | 'installing';

export function UpdaterFooter() {
  const [status, setStatus] = useState<UpdateStatus>('idle');
  const [update, setUpdate] = useState<Update | null>(null);
  const [version, setVersion] = useState<string | null>(null);

  useEffect(() => {
    setStatus('idle');
    getVersion().then(setVersion);
  }, []);

  async function checkForUpdates() {
    setStatus('checking');
    if (import.meta.env.DEV) {
        setUpdate({ version: '0.2.0' } as unknown as Update);
        setStatus('available');
    } else {
        check()
            .then((result) => {
        if (result) {
            setUpdate(result);
            setStatus('available');
        } else {
            setStatus('up-to-date');
        }
        })
        .catch(() => setStatus('idle'));
    }
  }

  async function installUpdate() {
    if (!update) return;
    setStatus('installing');
    await update.downloadAndInstall();
    await relaunch();
  }

  return (
    <div className="fixed bottom-0 right-0 flex items-center justify-end px-2 py-2 text-gray-600 text-xs gap-3">
      {version && <span>v{version}</span>}

      {(status === 'idle' || status === 'checking') && (
          <Button
            className="h-5 text-white bg-gray-500 hover:bg-gray-700"
            onPress={checkForUpdates}
            isLoading={status === 'checking'}
          >
            <ArrowPathIcon className="w-3 h-3" />
          </Button>
      )}

      {((status === 'available' || status === 'installing') && update) && (
        <>
          <span>Update {update.version} available</span>
          <Button
            onPress={installUpdate}
            className="h-5 text-white bg-gray-500 hover:bg-gray-700"
            isLoading={status === 'installing'}
          >
            Install &amp; restart
          </Button>
        </>
      )}
    </div>
  );
}