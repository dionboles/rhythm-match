import Head from 'next/head';
import AudioVis from '../components/AudioVis';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <h1>Rhythm Match</h1>
      <AudioVis />

      <style jsx>
        {`
          html {
            margin: 0;
            background: black;
          }

          canvas {
            width: 100%;
            height: 100%;
          }

          body {
            min-height: 100vh;
            display: grid;
            grid-template-rows: 1fr;
            margin: 0;
          }
        `}
      </style>
    </div>
  );
}
