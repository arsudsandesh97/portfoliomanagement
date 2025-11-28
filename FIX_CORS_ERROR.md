# How to Fix CORS Error for Firebase Storage

The error you are seeing (`Access to fetch at ... blocked by CORS policy`) happens because Firebase Storage blocks browser requests from `localhost` by default.

To fix this, you need to allow CORS (Cross-Origin Resource Sharing) on your storage bucket.

## Option 1: Using Google Cloud Console (Recommended)

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Make sure your project **sandesh-arsud** is selected.
3.  Click the **Activate Cloud Shell** icon (terminal icon) in the top right toolbar.
4.  Copy and paste the following commands into the Cloud Shell terminal:

```bash
# Create the CORS configuration file
echo '[{"origin": ["*"],"method": ["GET", "HEAD", "PUT", "POST", "DELETE"],"maxAgeSeconds": 3600}]' > cors.json

# Apply it to your bucket
gsutil cors set cors.json gs://sandesh-arsud.appspot.com
```

## Option 2: Using Local Terminal (If you have gcloud CLI installed)

1.  Open your terminal in this project folder.
2.  Run the following command (I have already created the `firebase-cors.json` file for you):

```bash
gsutil cors set firebase-cors.json gs://sandesh-arsud.appspot.com
```

Once you run this, the CORS error will disappear immediately, and you will be able to rename files.
