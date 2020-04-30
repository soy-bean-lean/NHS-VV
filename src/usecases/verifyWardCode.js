const verifyWardCode = ({ getDb }) => async (wardCode) => {
  const db = await getDb();

  try {
    const dbResponse = await db.any(
      `SELECT code FROM wards WHERE code = $1 LIMIT 1`,
      [wardCode]
    );

    if (dbResponse.length > 0) {
      return { validWardCode: true, error: null };
    } else {
      return { validWardCode: false, error: null };
    }
  } catch (error) {
    console.log(error);

    return {
      validWardCode: false,
      error: error.toString(),
    };
  }
};

export default verifyWardCode;