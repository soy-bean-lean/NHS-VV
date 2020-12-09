import React, { useState } from "react";
import Error from "next/error";
import { GridRow, GridColumn } from "../../../../src/components/Grid";
import Layout from "../../../../src/components/Layout";
import verifyTrustAdminToken from "../../../../src/usecases/verifyTrustAdminToken";
import propsWithContainer from "../../../../src/middleware/propsWithContainer";
import EditWardForm from "../../../../src/components/EditWardForm";
import Heading from "../../../../src/components/Heading";
import { TRUST_ADMIN } from "../../../../src/helpers/userTypes";

const EditAWard = ({
  error,
  id,
  name,
  hospitalId,
  hospital,
  hospitals,
  trust,
}) => {
  if (error) {
    return <Error />;
  }

  const [errors, setErrors] = useState([]);

  return (
    <Layout
      title="Edit a ward"
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
          <EditWardForm
            errors={errors}
            setErrors={setErrors}
            id={id}
            initialName={name}
            initialHospitalId={hospitalId}
            hospitals={hospitals}
          />
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyTrustAdminToken(async ({ container, query, authenticationToken }) => {
    const getRetrieveWardById = container.getRetrieveWardById();
    const trustResponse = await container.getRetrieveTrustById()(
      authenticationToken.trustId
    );

    let error = null;
    const getRetrieveWardByIdResponse = await getRetrieveWardById(
      query.id,
      authenticationToken.trustId
    );
    error = error || getRetrieveWardByIdResponse.error;

    const retrieveHospitalsByTrustId = container.getRetrieveHospitalsByTrustId();
    const retrieveHospitalsResponse = await retrieveHospitalsByTrustId(
      authenticationToken.trustId
    );

    const {
      hospital,
      error: hospitalError,
    } = await container.getRetrieveHospitalById()(
      getRetrieveWardByIdResponse.ward.hospitalId,
      authenticationToken.trustId
    );

    error = error || retrieveHospitalsResponse.error || hospitalError;
    if (error) {
      return { props: { error: error } };
    } else {
      return {
        props: {
          error: error,
          trust: { name: trustResponse.trust?.name },
          id: getRetrieveWardByIdResponse.ward.id,
          name: getRetrieveWardByIdResponse.ward.name,
          hospitalId: getRetrieveWardByIdResponse.ward.hospitalId,
          hospitals: retrieveHospitalsResponse.hospitals,
          hospital,
        },
      };
    }
  })
);

export default EditAWard;
