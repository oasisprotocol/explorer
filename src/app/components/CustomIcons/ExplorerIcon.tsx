import { FC } from 'react'
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'

export const ExplorerIcon: FC<SvgIconProps> = props => {
  return (
    <SvgIcon {...props} viewBox="0 0 167 31">
      <path d="M26.5963 4.64362C25.2926 3.31444 23.7511 2.22095 22.044 1.42684C21.9739 1.39075 21.9038 1.3589 21.8316 1.32705C21.4962 1.1763 21.1564 1.03403 20.8103 0.908761C19.8379 0.556295 18.8208 0.297253 17.7698 0.144376C17.0351 0.0382116 16.2835 -0.0212402 15.5191 -0.0212402C6.96226 -0.0212402 0 6.94102 0 15.4979C0 22.165 4.22534 27.8618 10.1408 30.0551C10.8373 30.312 11.5549 30.5222 12.2938 30.6772C13.3364 30.8981 14.415 31.017 15.5212 31.017C21.4155 31.017 26.5538 27.7131 29.1803 22.8593C30.3673 20.6681 31.0425 18.1583 31.0425 15.4957C31.0425 11.2725 29.346 7.43999 26.6005 4.63938L26.5963 4.64362ZM4.62664 23.8042C2.79212 21.3857 1.8239 18.5002 1.8239 15.4597C1.8239 10.2682 4.70308 5.73499 8.94753 3.37602C9.06007 3.31444 9.17048 3.46308 9.07706 3.55013C8.68849 3.91534 8.31692 4.30602 7.96233 4.72218C5.50144 7.59924 4.0852 11.5125 4.07246 15.4618C4.07246 20.5874 7.50158 26.1207 13.0412 26.1207C17.9842 26.1207 22.0079 21.339 22.0079 15.4618C22.0079 12.6994 21.0821 10.0474 19.5003 8.08123C19.4451 8.01116 19.5109 7.91349 19.5958 7.93897C22.269 8.72883 24.2671 11.8034 24.2671 15.4639C24.2671 18.6955 23.095 21.9123 21.0503 24.2904C18.9312 26.7555 16.086 28.1144 13.0412 28.1144C9.83507 28.1144 6.76479 26.5411 4.62664 23.8084V23.8042ZM26.6558 7.11938C28.4882 9.53143 29.4542 12.4149 29.4521 15.4533C29.4521 20.6447 26.5729 25.1779 22.3285 27.539C22.216 27.6006 22.1055 27.452 22.199 27.3649C22.5875 26.9997 22.9591 26.609 23.3137 26.1929C25.7746 23.3158 27.1908 19.4026 27.2036 15.4533C27.2036 10.3277 23.7745 4.79437 18.2348 4.79437C13.2918 4.79437 9.26815 9.57603 9.26815 15.4533C9.26815 18.2157 10.1939 20.8677 11.7758 22.8359C11.831 22.906 11.7651 23.0037 11.6802 22.9782C9.00699 22.1883 7.00897 19.1159 7.00897 15.4575C7.00897 12.2259 8.18103 9.0091 10.2258 6.63314C12.3448 4.16801 15.19 2.80911 18.2369 2.80911C21.441 2.80911 24.5091 4.38034 26.6558 7.11938ZM20.3857 15.4575C20.3857 19.1181 18.6064 22.2775 16.0584 23.6959C15.7421 23.8721 15.3535 23.8488 15.0605 23.6364L14.5148 23.2394C12.279 21.6087 10.8903 18.6255 10.8903 15.4533C10.8903 11.7927 12.6697 8.63328 15.2176 7.21493C15.534 7.03869 15.9225 7.06205 16.2155 7.27438L16.7612 7.67143C18.9971 9.30212 20.3857 12.2853 20.3857 15.4554V15.4575Z" />
      <path d="M43.9159 10.799C43.2237 10.3552 42.4126 10.1344 41.4869 10.1344C40.5611 10.1344 39.7479 10.3552 39.0493 10.799C38.3508 11.2428 37.8114 11.8755 37.4292 12.7015C37.0471 13.5274 36.856 14.5105 36.856 15.6507C36.856 16.7909 37.0471 17.7591 37.4292 18.5851C37.8114 19.4111 38.3508 20.0459 39.0493 20.4939C39.7479 20.9419 40.559 21.167 41.4869 21.167C42.4147 21.167 43.2237 20.9441 43.9159 20.4939C44.6081 20.0459 45.1474 19.4089 45.536 18.5851C45.9224 17.7591 46.1156 16.7824 46.1156 15.6507C46.1156 14.519 45.9224 13.5147 45.536 12.6951C45.1495 11.8755 44.6081 11.2428 43.9159 10.8011V10.799ZM43.5103 17.636C43.3129 18.1859 43.0368 18.6063 42.6844 18.8972C42.334 19.1881 41.9327 19.3325 41.4847 19.3325C41.0367 19.3325 40.6333 19.1881 40.2787 18.8972C39.922 18.6063 39.6438 18.1859 39.4464 17.636C39.2468 17.086 39.1491 16.4236 39.1491 15.6507C39.1491 14.8778 39.2489 14.2154 39.4464 13.6654C39.6438 13.1155 39.922 12.6951 40.2787 12.4042C40.6354 12.1133 41.0367 11.9689 41.4847 11.9689C41.9327 11.9689 42.3319 12.1133 42.6844 12.4042C43.0368 12.6951 43.3108 13.1113 43.5103 13.6569C43.7099 14.2026 43.8076 14.8672 43.8076 15.6507C43.8076 16.4342 43.7078 17.086 43.5103 17.636Z" />
      <path d="M50.0755 10.6843L47.4575 20.3559C47.3726 20.6722 47.6104 20.9822 47.9353 20.9822H49.1052C49.3303 20.9822 49.5277 20.8294 49.5851 20.6128L49.9864 19.0904C50.0437 18.8717 50.2412 18.7209 50.4662 18.7209H53.1352C53.3624 18.7209 53.5599 18.8738 53.6151 19.0925L54.0079 20.6107C54.0652 20.8294 54.2627 20.9822 54.4877 20.9822H55.715C56.042 20.9822 56.2798 20.6722 56.1927 20.3559L53.5599 10.6843C53.5004 10.4677 53.3051 10.3191 53.0821 10.3191H50.5554C50.3325 10.3191 50.135 10.4699 50.0777 10.6864L50.0755 10.6843ZM51.2073 16.8885C50.8824 16.8885 50.6446 16.5807 50.7274 16.2664L51.1669 14.5975L51.3262 13.9329C51.4472 13.4255 52.1691 13.4255 52.2901 13.9329L52.4494 14.5975L52.8804 16.2685C52.9611 16.5828 52.7254 16.8885 52.4005 16.8885H51.2051H51.2073Z" />
      <path d="M68.1575 10.8139V11.6547C68.1575 11.9286 68.3804 12.1515 68.6543 12.1515H69.4506C69.7245 12.1515 69.9474 12.3745 69.9474 12.6484V18.653C69.9474 18.9269 69.7245 19.1499 69.4506 19.1499H68.6543C68.3804 19.1499 68.1575 19.3728 68.1575 19.6467V20.4876C68.1575 20.7615 68.3804 20.9844 68.6543 20.9844H73.453C73.7269 20.9844 73.9498 20.7615 73.9498 20.4876V19.6467C73.9498 19.3728 73.7269 19.1499 73.453 19.1499H72.6567C72.3828 19.1499 72.1599 18.9269 72.1599 18.653V12.6484C72.1599 12.3745 72.3828 12.1515 72.6567 12.1515H73.453C73.7269 12.1515 73.9498 11.9286 73.9498 11.6547V10.8139C73.9498 10.54 73.7269 10.317 73.453 10.317H68.6543C68.3804 10.317 68.1575 10.54 68.1575 10.8139Z" />
      <path d="M83.9908 16.483C83.7827 16.0902 83.5067 15.7759 83.1648 15.536C82.823 15.2961 82.4514 15.1092 82.0501 14.9712C81.6467 14.8332 81.2432 14.7164 80.8356 14.6209C80.4279 14.5253 80.0542 14.4213 79.7123 14.3151C79.3705 14.2089 79.0987 14.0688 78.8949 13.8947C78.6911 13.7227 78.5891 13.4934 78.5891 13.2068C78.5891 12.8097 78.7399 12.5039 79.0393 12.2895C79.3387 12.075 79.7187 11.9689 80.1773 11.9689C80.4937 11.9689 80.791 12.022 81.0564 12.16C81.4067 12.3447 81.6467 12.6271 81.7804 12.8288C81.8717 12.9668 82.0267 13.0475 82.1923 13.0475H83.53C83.8761 13.0475 84.1245 12.6993 83.995 12.3765C83.9037 12.1472 83.7891 11.9349 83.6468 11.7396C83.271 11.2193 82.7784 10.8223 82.1732 10.5484C81.5681 10.2724 80.9035 10.1365 80.1795 10.1365C79.396 10.1365 78.7123 10.2745 78.1326 10.5484C77.553 10.8223 77.1007 11.1981 76.7801 11.6716C76.4595 12.1451 76.2981 12.6781 76.2981 13.2683C76.2981 13.8586 76.4 14.3087 76.6039 14.6803C76.8077 15.0519 77.0795 15.3513 77.4213 15.5742C77.7632 15.7993 78.1369 15.9819 78.5445 16.1241C78.9522 16.2664 79.3578 16.3896 79.7591 16.4915C80.1625 16.5934 80.5341 16.7038 80.8738 16.8206C81.2156 16.9374 81.4874 17.0881 81.6913 17.2707C81.8951 17.4533 81.997 17.6975 81.997 18.0033C81.997 18.4215 81.842 18.7464 81.532 18.9821C81.222 19.2157 80.8058 19.3324 80.2878 19.3324C79.6465 19.3324 79.1582 19.1435 78.8206 18.7676C78.6804 18.6105 78.5721 18.4215 78.4936 18.2028C78.415 17.9884 78.2176 17.844 77.9882 17.844H76.7843C76.4531 17.844 76.2174 18.1604 76.3066 18.4789C76.3873 18.7676 76.4956 19.0394 76.6336 19.2879C76.9691 19.8887 77.4489 20.3516 78.0689 20.6786C78.691 21.0035 79.43 21.167 80.2835 21.167C81.0585 21.167 81.7486 21.0311 82.3537 20.7614C82.9589 20.4918 83.4366 20.1202 83.7827 19.6467C84.1288 19.1732 84.3029 18.6211 84.3029 17.9884C84.3029 17.3556 84.1989 16.8758 83.9887 16.483H83.9908Z" />
      <path d="M65.7137 16.483C65.5056 16.0902 65.2296 15.7759 64.8877 15.536C64.5459 15.2961 64.1743 15.1092 63.773 14.9712C63.3696 14.8332 62.9661 14.7164 62.5585 14.6209C62.1508 14.5253 61.7771 14.4213 61.4353 14.3151C61.0934 14.2089 60.8216 14.0688 60.6178 13.8947C60.414 13.7227 60.312 13.4934 60.312 13.2068C60.312 12.8097 60.4628 12.5039 60.7622 12.2895C61.0616 12.075 61.4416 11.9689 61.9003 11.9689C62.2166 11.9689 62.5139 12.022 62.7793 12.16C63.1296 12.3447 63.3696 12.6271 63.5033 12.8288C63.5946 12.9668 63.7496 13.0475 63.9153 13.0475H65.2529C65.599 13.0475 65.8474 12.6993 65.7179 12.3765C65.6266 12.1472 65.512 11.9349 65.3697 11.7396C64.9939 11.2193 64.5013 10.8223 63.8961 10.5484C63.291 10.2724 62.6264 10.1365 61.9024 10.1365C61.1189 10.1365 60.4352 10.2745 59.8555 10.5484C59.2759 10.8223 58.8236 11.1981 58.503 11.6716C58.1824 12.1451 58.021 12.6781 58.021 13.2683C58.021 13.8586 58.1229 14.3087 58.3268 14.6803C58.5306 15.0519 58.8024 15.3513 59.1442 15.5742C59.4861 15.7993 59.8598 15.9819 60.2674 16.1241C60.6751 16.2664 61.0807 16.3896 61.482 16.4915C61.8854 16.5934 62.257 16.7038 62.5967 16.8206C62.9385 16.9374 63.2103 17.0881 63.4142 17.2707C63.618 17.4533 63.7199 17.6975 63.7199 18.0033C63.7199 18.4215 63.5649 18.7464 63.2549 18.9821C62.9449 19.2157 62.5287 19.3324 62.0107 19.3324C61.3694 19.3324 60.8811 19.1435 60.5435 18.7676C60.4033 18.6105 60.2951 18.4215 60.2165 18.2028C60.1379 17.9884 59.9405 17.844 59.7111 17.844H58.5072C58.176 17.844 57.9403 18.1604 58.0295 18.4789C58.1102 18.7676 58.2185 19.0394 58.3565 19.2879C58.692 19.8887 59.1718 20.3516 59.7918 20.6786C60.414 21.0035 61.1529 21.167 62.0064 21.167C62.7814 21.167 63.4715 21.0311 64.0766 20.7614C64.6818 20.4918 65.1595 20.1202 65.5056 19.6467C65.8517 19.1732 66.0258 18.6211 66.0258 17.9884C66.0258 17.3556 65.9218 16.8758 65.7116 16.483H65.7137Z" />
      <path d="M90.2525 16.0775H94.0702C94.3228 16.0775 94.5288 15.8716 94.5288 15.6189C94.5288 15.3662 94.3228 15.1603 94.0702 15.1603H90.2525C90.0678 15.1603 89.917 15.0095 89.917 14.8248V11.7397C89.917 11.5549 90.0678 11.4042 90.2525 11.4042H95.9323C96.185 11.4042 96.3909 11.1982 96.3909 10.9456C96.3909 10.6929 96.185 10.4869 95.9323 10.4869H89.2439C89.0592 10.4869 88.9084 10.6377 88.9084 10.8224V20.8082C88.9084 20.993 89.0592 21.1437 89.2439 21.1437H95.9939C96.2465 21.1437 96.4525 20.9378 96.4525 20.6851C96.4525 20.4324 96.2465 20.2265 95.9939 20.2265H90.2525C90.0678 20.2265 89.917 20.0757 89.917 19.891V16.4088C89.917 16.2241 90.0678 16.0733 90.2525 16.0733V16.0775Z" />
      <path d="M105.583 10.489H105.528C105.37 10.489 105.226 10.5676 105.141 10.6992L103.566 13.1601L102.689 14.5339C102.557 14.7398 102.253 14.7398 102.122 14.5339L101.26 13.1771L99.6842 10.7013C99.5993 10.5697 99.4549 10.489 99.2978 10.489H99.2065C98.8455 10.489 98.6268 10.8882 98.82 11.1918L101.572 15.5297C101.642 15.6401 101.642 15.7802 101.572 15.8885L98.682 20.4409C98.4888 20.7466 98.7075 21.1437 99.0685 21.1437H99.1173C99.2723 21.1437 99.4167 21.0651 99.5016 20.9356L101.275 18.2114L102.122 16.8376C102.251 16.6253 102.559 16.6253 102.691 16.8355L103.549 18.1965L105.292 20.9313C105.377 21.063 105.521 21.1437 105.678 21.1437H105.755C106.116 21.1437 106.334 20.7445 106.141 20.4409L103.22 15.8291C103.149 15.7187 103.149 15.5785 103.22 15.4681L105.965 11.1939C106.16 10.8882 105.942 10.489 105.578 10.489H105.583Z" />
      <path d="M114.704 10.8797C114.169 10.6206 113.541 10.4911 112.819 10.4911H109.305C109.044 10.4911 108.833 10.7034 108.833 10.9625V20.6892C108.833 20.9419 109.039 21.1479 109.292 21.1479H109.398C109.651 21.1479 109.857 20.9419 109.857 20.6892V17.224C109.857 17.0393 110.008 16.8886 110.192 16.8886H112.59C113.343 16.8886 114.006 16.7548 114.581 16.4851C115.157 16.2155 115.603 15.8397 115.917 15.3555C116.231 14.8736 116.39 14.3088 116.39 13.6675C116.39 13.0263 116.242 12.453 115.947 11.9795C115.651 11.506 115.237 11.1387 114.702 10.8797H114.704ZM114.543 15.3364C114.044 15.759 113.388 15.9692 112.573 15.9692H110.19C110.006 15.9692 109.855 15.8184 109.855 15.6337V11.7396C109.855 11.5549 110.006 11.4041 110.19 11.4041H112.817C113.56 11.4041 114.159 11.6101 114.611 12.022C115.063 12.4339 115.29 12.9817 115.29 13.6633C115.29 14.3449 115.042 14.9139 114.543 15.3343V15.3364Z" />
      <path d="M119.826 10.4891H119.719C119.467 10.4891 119.261 10.695 119.261 10.9477V20.8104C119.261 20.9951 119.411 21.1458 119.596 21.1458H125.688C125.941 21.1458 126.147 20.9399 126.147 20.6872C126.147 20.4345 125.941 20.2286 125.688 20.2286H120.62C120.435 20.2286 120.284 20.0778 120.284 19.8931V10.9456C120.284 10.6929 120.078 10.4869 119.826 10.4869V10.4891Z" />
      <path d="M134.515 10.9859C133.863 10.5336 133.094 10.3064 132.209 10.3064C131.323 10.3064 130.555 10.5336 129.903 10.9859C129.251 11.4381 128.748 12.0793 128.391 12.9095C128.034 13.7398 127.856 14.708 127.856 15.8185C127.856 16.9289 128.034 17.895 128.391 18.7189C128.748 19.5427 129.251 20.1839 129.903 20.6426C130.555 21.1012 131.323 21.3284 132.209 21.3284C133.094 21.3284 133.863 21.0991 134.515 20.6426C135.166 20.1839 135.67 19.5427 136.026 18.7189C136.383 17.895 136.561 16.9268 136.561 15.8185C136.561 14.7101 136.383 13.7398 136.026 12.9095C135.67 12.0793 135.166 11.4381 134.515 10.9859ZM135.071 18.2305C134.801 18.9227 134.421 19.4599 133.933 19.8421C133.444 20.2243 132.869 20.4154 132.207 20.4154C131.544 20.4154 130.971 20.2243 130.482 19.8421C129.994 19.4599 129.614 18.9227 129.344 18.2305C129.075 17.5383 128.941 16.7336 128.941 15.8185C128.941 14.9033 129.077 14.0986 129.344 13.4064C129.614 12.7142 129.994 12.177 130.482 11.7969C130.971 11.4148 131.546 11.2237 132.207 11.2237C132.867 11.2237 133.444 11.4148 133.933 11.7969C134.421 12.1791 134.801 12.7121 135.071 13.4C135.341 14.088 135.476 14.8948 135.476 15.8206C135.476 16.7463 135.341 17.5404 135.071 18.2326V18.2305Z" />
      <path d="M145.157 15.4511C145.492 15.1666 145.749 14.8439 145.927 14.4808C146.106 14.1198 146.195 13.7398 146.195 13.3427C146.195 12.7418 146.044 12.228 145.745 11.8012C145.445 11.3744 145.035 11.0474 144.515 10.8245C143.997 10.6015 143.411 10.489 142.759 10.489H139.158C138.895 10.489 138.683 10.7013 138.683 10.9646V20.6872C138.683 20.9398 138.889 21.1458 139.141 21.1458H139.233C139.485 21.1458 139.691 20.9398 139.691 20.6872V16.7017C139.691 16.517 139.842 16.3663 140.027 16.3663H141.099C141.158 16.3663 141.218 16.3833 141.271 16.4109C141.672 16.6402 142.042 16.8759 142.371 17.12C142.885 17.5022 143.32 17.9099 143.677 18.3409C144.033 18.7741 144.32 19.2242 144.539 19.6913C144.706 20.0502 144.838 20.4175 144.938 20.7912C144.991 20.995 145.167 21.1415 145.379 21.1415H145.481C145.781 21.1415 145.991 20.8613 145.927 20.5704C145.855 20.2434 145.76 19.9249 145.641 19.6149C145.452 19.1265 145.188 18.6552 144.847 18.2029C144.505 17.7506 144.078 17.3175 143.564 16.9056C143.322 16.7124 143.057 16.5255 142.766 16.345C143.188 16.3132 143.577 16.2389 143.929 16.12C144.413 15.9565 144.823 15.7335 145.159 15.449L145.157 15.4511ZM142.301 15.466H140.025C139.84 15.466 139.689 15.3152 139.689 15.1305V11.7417C139.689 11.557 139.84 11.4063 140.025 11.4063H142.757C143.184 11.4063 143.577 11.4848 143.934 11.642C144.29 11.7991 144.575 12.022 144.789 12.3065C145.004 12.5911 145.11 12.9372 145.11 13.3448C145.11 13.7716 144.987 14.1474 144.742 14.4681C144.498 14.7887 144.167 15.035 143.751 15.2091C143.333 15.3811 142.851 15.4681 142.301 15.4681V15.466Z" />
      <path d="M149.798 16.0775H153.616C153.868 16.0775 154.074 15.8716 154.074 15.6189C154.074 15.3662 153.868 15.1603 153.616 15.1603H149.798C149.613 15.1603 149.463 15.0095 149.463 14.8248V11.7397C149.463 11.5549 149.613 11.4042 149.798 11.4042H155.478C155.731 11.4042 155.937 11.1982 155.937 10.9456C155.937 10.6929 155.731 10.4869 155.478 10.4869H148.79C148.605 10.4869 148.454 10.6377 148.454 10.8224V20.8082C148.454 20.993 148.605 21.1437 148.79 21.1437H155.54C155.792 21.1437 155.998 20.9378 155.998 20.6851C155.998 20.4324 155.792 20.2265 155.54 20.2265H149.798C149.613 20.2265 149.463 20.0757 149.463 19.891V16.4088C149.463 16.2241 149.613 16.0733 149.798 16.0733V16.0775Z" />
      <path d="M164.691 18.2071C164.349 17.7549 163.922 17.3217 163.408 16.9098C163.166 16.7166 162.901 16.5297 162.61 16.3492C163.032 16.3174 163.421 16.2431 163.773 16.1242C164.257 15.9607 164.667 15.7377 165.003 15.4532C165.338 15.1687 165.595 14.846 165.773 14.4829C165.952 14.1219 166.041 13.7418 166.041 13.3448C166.041 12.7439 165.89 12.2301 165.591 11.8033C165.291 11.3765 164.882 11.0495 164.361 10.8266C163.843 10.6036 163.257 10.4911 162.606 10.4911H159.004C158.743 10.4911 158.529 10.7034 158.529 10.9667V20.6914C158.529 20.944 158.735 21.15 158.987 21.15H159.079C159.331 21.15 159.537 20.944 159.537 20.6914V16.706C159.537 16.5212 159.688 16.3705 159.873 16.3705H160.945C161.005 16.3705 161.064 16.3875 161.117 16.4151C161.518 16.6444 161.888 16.8801 162.217 17.1243C162.731 17.5064 163.166 17.9141 163.523 18.3451C163.879 18.7783 164.166 19.2284 164.385 19.6955C164.553 20.0544 164.684 20.4217 164.784 20.7954C164.837 20.9992 165.013 21.1458 165.226 21.1458H165.328C165.627 21.1458 165.837 20.8655 165.773 20.5746C165.701 20.2476 165.606 19.9291 165.487 19.6191C165.298 19.1308 165.035 18.6594 164.693 18.2071H164.691ZM159.537 11.7417C159.537 11.557 159.688 11.4062 159.873 11.4062H162.606C163.032 11.4062 163.425 11.4848 163.782 11.6419C164.139 11.799 164.423 12.022 164.638 12.3065C164.852 12.591 164.958 12.9371 164.958 13.3448C164.958 13.7716 164.835 14.1474 164.591 14.468C164.347 14.7886 164.015 15.0349 163.599 15.209C163.181 15.381 162.699 15.4681 162.149 15.4681H159.873C159.688 15.4681 159.537 15.3173 159.537 15.1326V11.7438V11.7417Z" />
    </SvgIcon>
  )
}