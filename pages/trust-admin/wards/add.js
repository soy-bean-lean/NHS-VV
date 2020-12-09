import React, { useState } from "react";
import { GridRow, GridColumn } from "../../../src/components/Grid";
import Layout from "../../../src/components/Layout";
import Heading from "../../../src/components/Heading";
import verifyTrustAdminToken from "../../../src/usecases/verifyTrustAdminToken";
import propsWithContainer from "../../../src/middleware/propsWithContainer";
import AddWardForm from "../../../src/components/AddWardForm";
import Error from "next/error";
import { TRUST_ADMIN } from "../../../src/helpers/userTypes";

const AddAWard = ({ trust, hospitals, error, hospitalId, hospital }) => {
  if (error) {
    return <Error />;
  }
  const [errors, setErrors] = useState([]);

  return (
    <Layout
      title="Add a ward"
      hasErrors={errors.length != 0}
      showNavigationBar={true}
      showNavigationBarForType={TRUST_ADMIN}
    >
      <GridRow>
        <GridColumn width="two-thirds">
          <Heading>
            <span className="nhsuk-caption-l">
              {trust.name}
              <span className="nhsuk-u-visually-hidden">-</span>
            </span>
            {hospital.name}
          </Heading>
          <AddWardForm
            errors={errors}
            setErrors={setErrors}
            hospitals={hospitals}
            defaultHospitalId={hospitalId}
          />
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyTrustAdminToken(async ({ container, authenticationToken, query }) => {
    const hospitalId = query.hospitalId || null;
    const trustResponse = await container.getRetrieveTrustById()(
      authenticationToken.trustId
    );

    const retrieveHospitalsByTrustId = container.getRetrieveHospitalsByTrustId();
    const { hospitals, hospitalsError } = await retrieveHospitalsByTrustId(
      authenticationToken.trustId
    );

    const {
      hospital,
      error: hospitalError,
    } = await container.getRetrieveHospitalById()(
      hospitalId,
      authenticationToken.trustId
    );

    return {
      props: {
        error: hospitalsError || hospitalError,
        trust: { name: trustResponse.trust?.name },
        hospitals,
        hospitalId,
        hospital,
      },
    };
  })
);

export default AddAWard;
