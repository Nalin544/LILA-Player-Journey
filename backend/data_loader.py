import os
import pandas as pd
import pyarrow.parquet as pq

DATA_FOLDER = "player_data"

def load_all_data():

    frames = []

    for root, dirs, files in os.walk(DATA_FOLDER):

        for file in files:

            filepath = os.path.join(root, file)

            try:

                table = pq.read_table(filepath)

                df = table.to_pandas()

                df["event"] = df["event"].apply(
                    lambda x: x.decode("utf-8")
                    if isinstance(x, bytes)
                    else x
                )

                frames.append(df)

            except:
                pass

    return pd.concat(frames, ignore_index=True)