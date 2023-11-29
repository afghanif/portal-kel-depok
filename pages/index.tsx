import { NextPage } from "next";
import Head from "next/head";
import LandingPageTemplate from "../templates/LandingPage/LandingPageTemplate";
import { fetchLanding, fetchWeather } from "@/templates/Api/MyController";

const Index: NextPage = ( props: any ) => {
  return (
    <>
      <Head>
        <title>Portal Diskominfo</title>
        <meta name="description" content="Portal Kecamatan Kota Depok" />
      </Head>
      <LandingPageTemplate {...props} />
    </>
  );
};

export default Index;

export async function getServerSideProps({ req }: any) {
  const url = new URL(`http://${req.headers.host}`);
  const host = url.hostname;

  const res = await fetchLanding(host);
  const getCuaca = await fetchWeather();
  return {
      props: {
          domain: res.domain,
          profilSite: res.profilSite,
          exLink: res.exLink,
          potensi: res.potensi,
          getCuaca : getCuaca,
      }
  }
}