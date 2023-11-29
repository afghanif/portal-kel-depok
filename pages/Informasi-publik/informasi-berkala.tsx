import { fetchInformasiBerkala } from "@/templates/Api/MyController";
import InformasiBerkala from "@/templates/InformasiPublik/InformasiBerkala";
import { NextPage } from "next";
import Head from "next/head";

const Index: NextPage = ( props: any ) => {
  return (
    <>
      <Head>
        <title>Informasi</title>
        <meta name="description" content="Portal Kecamatan Kota Depok" />
      </Head>
      <InformasiBerkala {...props} />
    </>
  )
}

export default Index;

export async function getServerSideProps({ req }: any) {
  const url = new URL(`http://${req.headers.host}`);
  const host = url.hostname;

  const res = await fetchInformasiBerkala(host);
  return {
      props: {
          domain: res.domain,
          profilSite: res.profilSite,
          exLink: res.exLink,
          informasiBerkala: res.informasiBerkala
      }
  }
}