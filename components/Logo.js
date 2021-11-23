import Image from "next/image";

const Logo = (props) => (
  <Image alt="Logo" src="/afrijula.png" width={75} height={50} {...props} />
);

export default Logo;
