import axios from "axios";

const defaultUrl = "http://18.183.198.182:3333/api/621f2588d8d85b8d78eb3e64";
const dollUrl = "http://18.183.198.182:3333/api/62419aa64139ba24abb709e8";

export async function getSizeColorOptions() {
  const sicoResponse = await axios.get(dollUrl);
  console.log(sicoResponse);
  return sicoResponse.data;
}
