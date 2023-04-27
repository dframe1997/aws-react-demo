import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";

type CSVFileImportProps = {
  url: string;
  title: string;
};

const createToken = (user: string, pass: string) => {
  return btoa(`${user}:${pass}`);
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    console.log("uploadFile to", url);
    // Can't use env variables in S3 Static websites, so need to hard code since we don't have a login system.
    // console.log("USERNAME: ", process.env.USERNAME);
    // console.log("PASSWORD: ", process.env.PASSWORD);
    if (file) {
      const tokenFromStorage = localStorage.getItem("authorization_token");
      const token = tokenFromStorage
        ? tokenFromStorage
        : createToken("dframe1997", "TEST_PASSWORD");
      localStorage.setItem("authorization_token", token);

      // Get the presigned URL
      await axios({
        method: "GET",
        url,
        headers: {
          Authorization: `Basic ${token}`,
        },
        params: {
          fileName: encodeURIComponent(file.name),
        },
      });
      removeFile();
    }
  };
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </Box>
  );
}
