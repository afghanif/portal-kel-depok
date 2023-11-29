import cache from 'memory-cache';
import { transformArray } from '../components/site';
const CACHE_DURATION = 15000;

export async function fetchData(host: any) {
  if (!host) {
    host = 'kel-tapos.depok.go.id';
  }
  host = 'kel-tapos.depok.go.id';

  // cache.clear();
  const cachedData = cache.get('apiData');
  if (cachedData) {
    return cachedData;
  }

  var res = await fetch(`https://cms.depok.go.id/ViewPortal/domainsite?domain=${host}`);
  const domain = await res.json();
  if (domain.Code == "404 Not Found!") {
    throw new Error("Domain not found!");
  }

  res = await fetch(`https://cms.depok.go.id/ViewPortal/profilsite?siteId=${domain.Id}`);
  var profilSite = await res.json();

  res = await fetch(`https://cms.depok.go.id/ViewPortal/getExLink?siteId=${domain.Id}&code=&groupId=&typeId=EP&limit=&offset=`);
  const exLink = await res.json();

  // res = await fetch(`https://cms.depok.go.id/ViewPortal/getPengunjung?siteid=${domain.Id}`);
  // const visit = await res.json();

  const data = { domain, profilSite: profilSite[0], exLink };
  // cache.put('apiData', data, CACHE_DURATION);

  return data;
}

export async function fetchLanding(host: any) {
  var textRes;
  const cachedData = await fetchData(host);
  const { domain } = cachedData;

  var res = await fetch(`https://cms.depok.go.id/ViewPortal/getPlace?siteId=${domain.Id}&typeId=&limit=&offset=`);
  textRes = await res.text();
  const potensi = textRes != "" ? JSON.parse(textRes) : null;

  return { ...cachedData, potensi };
}

export async function fetchHome(host: any) {
  var textRes;
  const cachedData = await fetchData(host);
  const { domain } = cachedData;

  var res = await fetch(`https://cms.depok.go.id/ViewPortal/getSlider?siteId=${domain.Id}&typeId=SL01&status=ST01&fileType=FL02`);
  textRes = await res.text();
  const slider = textRes != "" ? JSON.parse(textRes) : null;

  res = await fetch(`https://dsw.depok.go.id/index.php/api/slider`);
  textRes = await res.text();
  const galeriKegiatan = textRes != "" ? JSON.parse(textRes) : null;

  res = await fetch(`https://cms.depok.go.id/ViewPortal/get_content?siteId=${domain.Id}&status=ST01&kanalType=K008&limit=&offset=&category=&slug=&key=`);
  textRes = await res.text();
  const pengumuman = textRes != "" ? JSON.parse(textRes) : null;

  res = await fetch(`https://cms.depok.go.id/ViewPortal/get_content?siteId=${domain.Id}&status=ST01&kanalType=K010&limit=3&offset=&category=1080&=slug=&key=`);
  textRes = await res.text();
  const dokumen = textRes != "" ? JSON.parse(textRes) : null;

  res = await fetch(`https://cms.depok.go.id/ViewPortal/getPlace?siteId=${domain.Id}&typeId=&limit=&offset=`);
  textRes = await res.text();
  const potensi = textRes != "" ? JSON.parse(textRes) : null;

  res = await fetch(`https://cms.depok.go.id/ViewPortal/getEvent?siteId=${domain.Id}&type=AG01&limit=`);
  textRes = await res.text();
  const agenda = textRes != "" ? JSON.parse(textRes) : null;

  res = await fetch(`https://cms.depok.go.id/ViewPortal/get_content?siteId=${domain.Id}&kanalType=K010&limit=&offset=&category=&slug=&key=`);
  textRes = await res.text();
  const layanan = textRes != "" ? JSON.parse(textRes) : null;

  res = await fetch(`https://cms.depok.go.id/ViewPortal/getExLink?siteId=2&code=&groupId=&typeId=LM&limit=&offset=&slug=`);
  textRes = await res.text();
  const layananKota = textRes != "" ? JSON.parse(textRes) : null;

  res = await fetch(`https://dsw.depok.go.id/api/komoditas/harga_depok`);
  textRes = await res.text();
  const hargaKomoditas = textRes != "" ? JSON.parse(textRes) : null;

  res = await fetch(`https://www.depok.go.id/api/youtube`);
  textRes = await res.text();
  const channel = textRes != "" ? JSON.parse(textRes) : null;

  res = await fetch(`https://berita.depok.go.id/api/v1/berita`);
  textRes = await res.text();
  const beritaKota = textRes != "" ? JSON.parse(textRes) : null;

  res = await fetch(`https://cms.depok.go.id/ViewPortal/get_content?siteId=${domain.Id}&status=ST01&kanalType=K001&limit=&offset=&category=&slug=&key=`);
  textRes = await res.text();
  const berita = textRes != "" ? JSON.parse(textRes) : null;

  res = await fetch(`https://cms.depok.go.id/ViewPortal/getContentByKecamatan?siteId=${domain.Id}&status=&kanalType=K001&limit=&offset=&category=`);
  textRes = await res.text();
  const beritaKelurahan = textRes != "" ? JSON.parse(textRes) : null;

  res = await fetch(`https://cms.depok.go.id/ViewPortal/getExLink?siteId=${domain.Id}&typeId=EP`);
  textRes = await res.text();
  const client = textRes != "" ? JSON.parse(textRes) : null;

  return { ...cachedData, slider, galeriKegiatan, pengumuman, dokumen, potensi, agenda, layanan, layananKota, hargaKomoditas, channel, beritaKota, berita, beritaKelurahan, client };
}

export async function fetchBerita(host: any) {
  var textRes;
  const cachedData = await fetchData(host);
  const { domain } = cachedData;

  var res = await fetch(`https://cms.depok.go.id/ViewPortal/get_content?siteId=${domain.Id}&status=ST01&kanalType=K001&limit=&offset=&category=&slug=&key=`);
  textRes = await res.text();
  const berita = textRes != "" ? JSON.parse(textRes) : null;

  const categoryRes = await fetch(`https://cms.depok.go.id/ViewPortal/ContentCategory?siteId=${domain.Id}&status=ST01&kanalType=K001&Id=`);
  const categoryText = await categoryRes.text();
  const categories = categoryText !== '' ? JSON.parse(categoryText) : [];

  return { ...cachedData, berita, categories };
}

export async function fetchDetailBerita(host: any, slug_title: string) {
  var textRes;
  const cachedData = await fetchData(host);
  const { domain } = cachedData;

  var res = await fetch(`https://cms.depok.go.id/ViewPortal/get_content?siteId=${domain.Id}&status=ST01&kanalType=K001&limit=&offset=&category=&slug=${slug_title}&key=`);
  textRes = await res.text();
  const berita = textRes != "" ? JSON.parse(textRes) : null;

  var res = await fetch(`https://cms.depok.go.id/ViewPortal/get_content?siteId=${domain.Id}&status=ST01&kanalType=K001&limit=&offset=&category=&slug=&key=`);
  textRes = await res.text();
  const beritaPopuler = textRes != "" ? JSON.parse(textRes) : null;

  return { ...cachedData, berita, beritaPopuler };
}

export async function fetchJenisLayanan(host: any) {
  var textRes;
  const cachedData = await fetchData(host);
  const { domain } = cachedData;

  var res = await fetch(`https://cms.depok.go.id/ViewPortal/get_content?siteId=${domain.Id}&kanalType=K010&limit=&offset=&category=&slug=&key=`);
  textRes = await res.text();
  const layanan = textRes != "" ? JSON.parse(textRes) : null;

  return { ...cachedData, layanan };
}

export async function fetchInformasiBerkala(host: any) {
  var textRes;
  const cachedData = await fetchData(host);
  const { domain } = cachedData;

  var res = await fetch(`https://cms.depok.go.id/ViewPortal/get_content?siteId=${domain.Id}&status=ST01&kanalType=K016&limit=&offset=&category=1172&slug=&key=`);
  textRes = await res.text();
  const informasiBerkala = textRes != "" ? JSON.parse(textRes) : null;


  return { ...cachedData, informasiBerkala };
}

export async function fetchInformasiSertaMerta(host: any) {
  var textRes;
  const cachedData = await fetchData(host);
  const { domain } = cachedData;

  var res = await fetch(`https://cms.depok.go.id/ViewPortal/get_content?siteId=${domain.Id}&status=ST01&kanalType=K016&limit=&offset=&category=1180&slug=&key=`);
  textRes = await res.text();
  const sertaMerta = textRes != "" ? JSON.parse(textRes) : null;

  return { ...cachedData, sertaMerta };
}

export async function fetchInformasiSetiapSaat(host: any) {
  var textRes;
  const cachedData = await fetchData(host);
  const { domain } = cachedData;

  var res = await fetch(`https://cms.depok.go.id/ViewPortal/get_content?siteId=${domain.Id}&status=ST01&kanalType=K016&limit=&offset=&category=1181&slug=&key=`);
  textRes = await res.text();
  const dataSetiapSaat = textRes != "" ? JSON.parse(textRes) : null;


  return { ...cachedData, dataSetiapSaat };
}

export async function fetchLayananKota(host: any) {
  var textRes;
  const cachedData = await fetchData(host);
  const { domain } = cachedData;

  var res = await fetch(`https://cms.depok.go.id/ViewPortal/getExLink?siteId=2&code=&groupId=&typeId=LM&limit=&offset=&parent=`);
  textRes = await res.text();
  const layananKota = textRes != "" ? JSON.parse(textRes) : null;

  return { ...cachedData, layananKota };
}

export async function fetchDetailLayananKota(host: any, Id: string) {
  var textRes;
  const cachedData = await fetchData(host);
  const { domain } = cachedData;

  var res = await fetch(`https://cms.depok.go.id/ViewPortal/getExLink?siteId=2&code=&groupId=&typeId=LM&limit=&offset=&parent=${Id}`);
  textRes = await res.text();
  const layananKota = textRes != "" ? JSON.parse(textRes) : null;

  return { ...cachedData, layananKota };
}

export async function fetchProfil(host: any) {
  var textRes;
  const cachedData = await fetchData(host);
  const { domain } = cachedData;

  var res = await fetch(`https://cms.depok.go.id/ViewPortal/get_content?siteId=${domain.Id}&status=ST01&kanalType=K006&limit=&offset=&category=1083&slug=&key=`);
  textRes = await res.text();
  const image = textRes != "" ? JSON.parse(textRes) : null;

  var res = await fetch(`https://cms.depok.go.id/ViewPortal/get_content?siteId=${domain.Id}&status=ST01&kanalType=K006&limit=&offset=&category=1073&slug=&key=`);
  textRes = await res.text();
  const tugasPokok = textRes != "" ? JSON.parse(textRes) : null;

  var res = await fetch(`https://cms.depok.go.id/ViewPortal/get_content?siteId=${domain.Id}&status=ST01&kanalType=K003&limit=&offset=&category=&slug=&key=`);
  textRes = await res.text();
  const landasanHukum = textRes != "" ? JSON.parse(textRes) : null;

  return { ...cachedData, image, tugasPokok, landasanHukum };
}

export async function fetchMaklumatPelayanan(host: any) {
  var textRes;
  const cachedData = await fetchData(host);
  const { domain } = cachedData;

  var res = await fetch(`https://cms.depok.go.id/ViewPortal/get_content?siteId=${domain.Id}&status=ST01&kanalType=K003&limit=&offset=&category=1081&slug=&key=`);
  textRes = await res.text();
  const maklumat = textRes != "" ? JSON.parse(textRes) : null;

  return { ...cachedData, maklumat };
}

export async function fetchMottoPelayanan(host: any) {
  var textRes;
  const cachedData = await fetchData(host);
  const { domain } = cachedData;

  var res = await fetch(`https://cms.depok.go.id/ViewPortal/get_content?siteId=${domain.Id}&status=ST01&kanalType=K003&limit=&offset=&category=1081&slug=&key=`);
  textRes = await res.text();
  const motto = textRes != "" ? JSON.parse(textRes) : null;

  return { ...cachedData, motto };
}

export async function fetchPotensi(host: any) {
  var textRes;
  const cachedData = await fetchData(host);
  const { domain } = cachedData;

  var res = await fetch(`https://cms.depok.go.id/ViewPortal/getPlace?siteId=${domain.Id}&typeId=&limit=&offset=`);
  textRes = await res.text();
  const potensi = textRes != "" ? JSON.parse(textRes) : null;

  return { ...cachedData, potensi };
}

export async function fetchStandarPelayanan(host: any) {
  var textRes;
  const cachedData = await fetchData(host);
  const { domain } = cachedData;

  var res = await fetch(`https://cms.depok.go.id/ViewPortal/get_content?siteId=${domain.Id}&status=ST01&kanalType=K006&limit=&offset=&category=1150&slug=&key=`);
  textRes = await res.text();
  const standarPelayanan = textRes != "" ? JSON.parse(textRes) : null;

  return { ...cachedData, standarPelayanan };
}

export async function fetchListStandarPelayanan(host: any) {
  var textRes;
  const cachedData = await fetchData(host);
  const { domain } = cachedData;

  var res = await fetch(`https://cms.depok.go.id/ViewPortal/get_content?siteId=${domain.Id}&status=ST01&kanalType=K010&limit=&offset=&category=1148&=slug=&key=`);
  textRes = await res.text();
  const listStandarPelayanan = textRes != "" ? JSON.parse(textRes) : null;

  return { ...cachedData, listStandarPelayanan };
}

export async function fetchAgenda(host: any) {
  var textRes;
  const cachedData = await fetchData(host);
  const { domain } = cachedData;

  var res = await fetch(`https://cms.depok.go.id/ViewPortal/getEvent?siteId=${domain.Id}&type=AG01&limit=`);
  textRes = await res.text();
  const agenda = textRes != "" ? JSON.parse(textRes) : null;

  return { ...cachedData, agenda };
}

export async function fetchGaleri(host: any) {
  var textRes;
  const cachedData = await fetchData(host);
  const { domain } = cachedData;

  var res = await fetch(`https://cms.depok.go.id/ViewPortal/getGallery?siteId=${domain.Id}&category=&limit=&type=&offset=`);
  textRes = await res.text();
  const galeri = textRes != "" ? JSON.parse(textRes) : null;

  var res = await fetch(`https://www.depok.go.id/api/youtube`);
  textRes = await res.text();
  const video = textRes != "" ? JSON.parse(textRes) : null;

  return { ...cachedData, galeri, video };
}

export async function fetchFaq(host: any) {
  var textRes;
  const cachedData = await fetchData(host);
  const { domain } = cachedData;

  var res = await fetch(`https://cms.depok.go.id/ViewPortal/get_content?siteId=${domain.Id}&status=ST01&kanalType=K017&limit=&offset=&category=&=slug=&key=`);
  textRes = await res.text();
  const faq = textRes != "" ? JSON.parse(textRes) : null;

  return { ...cachedData, faq };
}

export async function fetchDokumen(host: any) {
  var textRes;
  const cachedData = await fetchData(host);
  const { domain } = cachedData;

  var res = await fetch(`https://cms.depok.go.id/ViewPortal/get_content?siteId=${domain.Id}&status=ST01&kanalType=K010&limit=&offset=&category=&=slug=&key=`);
  textRes = await res.text();
  const dokumen = textRes != "" ? JSON.parse(textRes) : null;

  return { ...cachedData, dokumen };
}

export async function fetchPengumuman(host: any) {
  var textRes;
  const cachedData = await fetchData(host);
  const { domain } = cachedData;

  var res = await fetch(`https://cms.depok.go.id/ViewPortal/get_content?siteId=${domain.Id}&status=ST01&kanalType=K008&limit=&offset=&category=&slug=&key=`);
  textRes = await res.text();
  const pengumuman = textRes != "" ? JSON.parse(textRes) : null;

  const categoryRes = await fetch(`https://cms.depok.go.id/ViewPortal/ContentCategory?siteId=${domain.Id}&status=ST01&kanalType=K008&Id=`);
  const categoryText = await categoryRes.text();
  const categories = categoryText !== '' ? JSON.parse(categoryText) : [];

  return { ...cachedData, pengumuman, categories };
}

export async function fetchDetailPengumuman(host: any, slug_title: string) {
  var textRes;
  const cachedData = await fetchData(host);
  const { domain } = cachedData;

  var res = await fetch(`https://cms.depok.go.id/ViewPortal/get_content?siteId=${domain.Id}&status=ST01&kanalType=K008&limit=&offset=&category=&slug=${slug_title}&key=`);
  textRes = await res.text();
  const pengumuman = textRes != "" ? JSON.parse(textRes) : null;

  var res = await fetch(`https://cms.depok.go.id/ViewPortal/get_content?siteId=${domain.Id}&status=ST01&kanalType=K008&limit=&offset=&category=&slug=&key=`);
  textRes = await res.text();
  const pengumumanPopuler = textRes != "" ? JSON.parse(textRes) : null;

  return { ...cachedData, pengumuman, pengumumanPopuler };
}

export async function fetchKontak(host: any) {
  var textRes;
  const cachedData = await fetchData(host);
  const { domain } = cachedData;

  var res = await fetch(`https://cms.depok.go.id/ViewPortal/profilsite?siteId=${domain.Id}`);
  textRes = await res.text();
  const kontak = textRes != "" ? JSON.parse(textRes) : null;

  return { ...cachedData, kontak };
}

export async function fetchChartKependudukan(Domain: any) {
  const postData = {
    tahun: '2022',
    title: 'PENDUDUK BERDASARKAN JENIS KELAMIN',
    kecamatan: Domain.Kecamatan,
    kelurahan: Domain.Kelurahan,
  };


  try {
    const { token, url } = await getToken();
    const golangResponse = await fetch(`${url}/kependudukan/rekap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(postData),
    });

    const responseData = await golangResponse.json();

    if (golangResponse.ok && responseData.data) {
      const stdApi = transformArray('subdimensi', 'dimensi', responseData.data)
      // const totalPendudukData = responseData.data;
      const categories = stdApi[0].values;
      let series: any = [];

      stdApi.map((item: any, i: number) => {
        if (i > 0) {
          series.push({
            name: item.caption,
            data: item.values
          })
        }
      })
      // console.log(series);
      // const chart = <ChartBuilder id="pegawai-statistik-chart" options={'dashboardNoLabelColumn'} type="bar" series={series} categories={categories} />
      // console.log(chart);

      return { categories, series };
    } else {
      throw new Error('Failed to fetch data from API Golang');
    }
  } catch (error) {
    console.error(error);
  }
}

export async function fetchChartKepegawaian(Domain: any) {
  const postData = {
    tahun: '2022',
    title: 'Pegawai per Pendidikan',
    kecamatan: Domain.Kecamatan,
    kelurahan: Domain.Kelurahan,

  };


  try {
    const { token, url } = await getToken();
    const golangResponse = await fetch(`${url}/kepegawaian/rekap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(postData),
    });

    const responseData = await golangResponse.json();

    if (golangResponse.ok && responseData.data) {
      const stdApi = transformArray('subdimensi', 'dimensi', responseData.data)
      // const totalPendudukData = responseData.data;
      const categories = stdApi[0].values;
      let series: any = [];

      stdApi.map((item: any, i: number) => {
        if (i > 0) {
          series.push({
            name: item.caption,
            data: item.values
          })
        }
      })
      // console.log(series);
      // const chart = <ChartBuilder id="pegawai-statistik-chart" options={'dashboardNoLabelColumn'} type="bar" series={series} categories={categories} />
      // console.log(chart);

      return { categories, series };
    } else {
      throw new Error('Failed to fetch data from API Golang');
    }
  } catch (error) {
    console.error(error);
  }
}

export async function fetchChartKesehatan(Domain: any) {
  const postData = {
    tahun: '2022',
    title: 'Faskes Berdasarjan Jenis Kelamin',
    kecamatan: Domain.Kecamatan,
    kelurahan: Domain.Kelurahan,

  };


  try {
    const { token, url } = await getToken();
    const golangResponse = await fetch(`${url}/kesehatan/rekap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(postData),
    });

    const responseData = await golangResponse.json();

    if (golangResponse.ok && responseData.data) {
      const stdApi = transformArray('subdimensi', 'dimensi', responseData.data)
      // const totalPendudukData = responseData.data;
      const categories = stdApi[0].values;
      let series: any = [];

      stdApi.map((item: any, i: number) => {
        if (i > 0) {
          series.push({
            name: item.caption,
            data: item.values
          })
        }
      })
      // console.log(series);
      // const chart = <ChartBuilder id="pegawai-statistik-chart" options={'dashboardNoLabelColumn'} type="bar" series={series} categories={categories} />
      // console.log(chart);

      return { categories, series };
    } else {
      throw new Error('Failed to fetch data from API Golang');
    }
  } catch (error) {
    console.error(error);
  }
}

export async function fetchChartPenyakit(Domain: any) {
  const postData = {
    tahun: '2019',
    title: 'Penyakit Berdasarkan Jenis Kelamin 2',
    kecamatan: Domain.Kecamatan,
    kelurahan: Domain.Kelurahan,

  };


  try {
    const { token, url } = await getToken();
    const golangResponse = await fetch(`${url}/kesehatan/rekap/penyakit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(postData),
    });

    const responseData = await golangResponse.json();

    if (golangResponse.ok && responseData.data) {
      const stdApi = transformArray('subdimensi', 'dimensi', responseData.data)
      // const totalPendudukData = responseData.data;
      const categories = stdApi[0].values;
      let series: any = [];

      stdApi.map((item: any, i: number) => {
        if (i > 0) {
          series.push({
            name: item.caption,
            data: item.values
          })
        }
      })
      // console.log(series);
      // const chart = <ChartBuilder id="pegawai-statistik-chart" options={'dashboardNoLabelColumn'} type="bar" series={series} categories={categories} />
      // console.log(chart);

      return { categories, series };
    } else {
      throw new Error('Failed to fetch data from API Golang');
    }
  } catch (error) {
    console.error(error);
  }
}

export async function getToken() {
  const url = process.env.NEXT_PUBLIC_WEBSITE_DOMAIN
  const tokenAuthUrl = `${url}/auth`
  const response = await fetch(tokenAuthUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      Email: process.env.NEXT_PUBLIC_USERNAME,
      Password: process.env.NEXT_PUBLIC_PASSWORD
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  } else {
    const data = await response.json();
    const token = data.data.token;

    return { token, url }

  }
}

export async function kepegawaianDw(Domain: any) {
  try {
    const { token, url } = await getToken();
    const response = await fetch(`${url}/kepegawaian/rawdata`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(
        {
          nama_pegawai: '',
          instansi: Domain.Organisasi,
          jabatan: '',
          unit_kerja: '',
        }
      )
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      const dataKepegawaian = await response.json();

      return dataKepegawaian
    }
  } catch (error) {
    console.error(error);
  }
}

export async function pendudukDw(Domain: any) {
  try {
    const { token, url } = await getToken();
    const response = await fetch(`${url}/kependudukan/rekap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(
        {
          tahun: '2020',
          kecamatan: Domain.Kecamatan,
          kelurahan: Domain.Kelurahan,
          jumlah: '',
          title: 'PENDUDUK BERDASARKAN JENIS KELAMIN'
        }
      )
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      const dataWarga = await response.json();

      return { dataWarga, token, url }
    }
  } catch (error) {
    console.error(error);
  }
}


export async function fetchWeather() {
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=-6.4054801&lon=106.8184199&appid=06946cbe5b3adecc7da685e69d2e94e5`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'API-Key': 'appid '

      }
    });
    if (!res.ok) {
      throw new Error("HTTP status " + res.status);
    }
    const getCuaca = await res.json();
    return getCuaca;
  } catch (error: any) {
    console.error(`There was an error in your fetch operation: ${error.message}`);
    return null;
  }
}