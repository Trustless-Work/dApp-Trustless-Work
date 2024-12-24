import { Bounded } from "@/components/layout/Bounded";
import HeaderWithoutAuth from "@/components/layout/header/HeaderWithoutAuth";
import Connect from "@/components/utils/Connect";

const ResquestApiKeyWithoutAuthPage = () => {
  return (
    <>
      <HeaderWithoutAuth highlightConnect={true} />
      <Bounded center={true} className="mt-20">
        <Connect />
      </Bounded>
    </>
  );
};

export default ResquestApiKeyWithoutAuthPage;
