import cliProgress from 'cli-progress';

export const convertMbps = (byts) => byts / 1_000_000;

export const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

export const bar2 = new cliProgress.SingleBar({
    format: 'Speed: {speed} MB/s || Downloaded: {downloaded} MB || No. of Peers: {peers} || Name: {torrentName}'
}, cliProgress.Presets.shades_classic);