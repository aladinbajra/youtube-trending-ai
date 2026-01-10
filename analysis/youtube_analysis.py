#!/usr/bin/env python
# coding: utf-8

# YouTube Virality Predictor - Data Analysis

# # 🚀 YouTube Trending Video Analytics and Virality Estimation 
# 
# Local YouTube Analytics Research Platform
# 
# ## 🎯 YouTube Trending Video Analytics
# 
# ### **Project Purpose**  
# The **Tube Virality** project aims to **collect, analyze, and model YouTube trending video data** across multiple countries using the **YouTube API**. It aims to gather metrics like view counts, likes, and descriptions, then apply data science techniques to predict a video's likelihood of going viral.
# 
# 
# ### **Key Objectives**  
# - ✅ **Collect Data via YouTube API**: Fetch trending videos and their statistics
# - ✅ **Build Historical Database**: Track daily metrics for trending videos across countries
# - ✅ **Identify Virality Patterns**: Analyze what characteristics correlate with viral success
# - ✅ **Develop Predictive Models**: Create ML models to estimate virality potential
# - ✅ **Provide Actionable Insights**: Help content creators understand virality factors
# 
# ---
# 
# ## 🛠️ How the Data is Collected  
# 
# The data is automatically collected using the **YouTube API** and stored locally at:  
# 📁 assets/meta/trending/ - Trending Video Metadata  
# 
# ### **Data Collection Process**  
# 1. **Fetching Trending Videos**  
#    - Using the YouTube API, trending videos from multiple countries are retrieved.  
#    - The list of trending videos is stored and continuously updated (_daily updates_).
# 
# 2. **Daily Statistics Updates** (Automated)  
#    - A scheduled workflow updates video statistics (views, likes, comments, video description, video privacy status, etc.).  
#    - These updates provide **historical trends** for analysis.  
#    - The latest data is stored locally at:  
#      📁 assets/meta/video_stats/ - Video Statistics  
# 
# ```mermaid
# graph TD;
#     A[trending.py: Fetch Trending Videos] -->|Generates daily JSON files - one per country| B[trending_db.py: Aggregate Trending Data];
#     B -->|Merges all country JSONs into a unified CSV| C[video_stats.py: Extract & Fetch Video Stats];
#     C -->|Creates a daily JSON file with statistics for all videos| D[video_stats_db.py: Compile Video Stats History];
#     D -->|Combines all daily stats JSONs into a final dataset| E[Complete Merged Video Stats JSON];
# ```
# ---
# 
# ## 📈 Defining Video Virality  
# 
# Virality isn't simply measured by raw view count. Our analysis considers multiple factors, for example:
# - A YouTuber with **1M subscribers** getting **20M views** is - potentially- expected.  
# - A YouTuber with **10K subscribers** getting **2M views** is **extraordinary**.  
# 
# Our models will classify videos as **"success" (viral)** or **"non-success"**, based on the metrics retrieved, but the success/non-success will be up to us to decide.
# 
# 
# 
# ### 🔎 **Key Virality Metrics**  
# 
# | **Metric**            | **Description**                                             | **Importance** |
# |------------------------|------------------------------------------------------------|----------------|
# | **Engagement Rate**     | Likes, comments, and shares relative to views             | High           |
# | **Growth Velocity**     | How quickly a video gains views in the first hours/days   | Critical       |
# | **Audience Reach**      | Views relative to channel subscriber count                | High           |
# | **Subscriber Growth**   | New subscribers gained after video publication            | Medium         |
# | **Trending Duration**   | How long a video remains on trending lists                | Medium         |
# 
# ---
# 
# ## 📊 Dataset & Features  
# 
# Our dataset includes key **video metadata** and **engagement statistics**, such as:  
# 
# - **Video Details**: Title, description, duration, resolution  
# - **Engagement Metrics**: Views, likes, comments, favorite count  
# - **Channel Details**: Subscriber count, total videos, upload frequency  
# - **Trending History**: How long a video remains on the trending list  
# - **Country-Based Analysis**: Virality trends across different regions  
# 
# 📌 **Goal:** Use these features to identify patterns and train models for virality prediction.  
# 
# ---
# 
# ## 🔬 Methodology  
# 
# 1️⃣ **Data Collection** – Retrieve daily trending videos across countries.  
# 2️⃣ **Data Cleaning & Preprocessing** – Handle missing values, outliers, and standardize data.  
# 3️⃣ **Exploratory Analysis** – Identify key trends and patterns.  
# 4️⃣ **Feature Engineering** – Extract additional insights like growth rate and engagement score.  
# 5️⃣ **Model Development** – Train ML models for virality prediction.  
# 6️⃣ **Evaluation & Interpretation** – Validate predictions and refine models.  
# 
# ---
# 
# ## 🔨  Technologies Utilized  
# 
# We've harnessed a blend of cutting-edge technologies to power the **Tube Virality** project:  
# 🔹 **Python 3.9** – Data processing, analysis, and ML model training. (currently)<br/>
# 🔹 **SQL** – Storing structured video metadata for analysis. (future iteration)
# 

# <br/>

# # Analysis

# In[1]:


import re
import json
import logging
import warnings
import numpy as np
import pandas as pd
from io import StringIO
import matplotlib.figure
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from typing import Optional, Union, List, Dict, Any, Tuple


# In[2]:


class LocalDataLoader:
    """Loads data from local CSV files"""
    def __init__(self, file_path: str) -> None:
        self.file_path = file_path

    def get_csv_file(self) -> str:
        with open(self.file_path, 'r', encoding='utf-8') as f:
            return f.read()

    def csv_to_dataframe(self, csv_content: str) -> pd.DataFrame:
        df = pd.read_csv(StringIO(csv_content))
        return df


# In[3]:


YOUTUBE_CATEGORY_MAP = {
    1: "Film & Animation",
    2: "Autos & Vehicles",
    10: "Music",
    15: "Pets & Animals",
    17: "Sports",
    18: "Short Movies",
    19: "Travel & Events",
    20: "Gaming",
    21: "Videoblogging",
    22: "People & Blogs",
    23: "Comedy",
    24: "Entertainment",
    25: "News & Politics",
    26: "Howto & Style",
    27: "Education",
    28: "Science & Technology",
    29: "Nonprofits & Activism",
    30: "Movies",
    31: "Anime/Animation",
    32: "Action/Adventure",
    33: "Classics",
    34: "Comedy (Movies)",
    35: "Documentary",
    36: "Drama",
    37: "Family",
    38: "Foreign",
    39: "Horror",
    40: "Sci-Fi/Fantasy",
    41: "Thriller",
    42: "Shorts",
    43: "Shows",
    44: "Trailers"
}


# ## Trending Videos Analysis

# In[4]:


loader = LocalDataLoader(file_path='db/ods/trending_videos.csv')

trending_videos_content = loader.get_csv_file()

trending_videos_df = loader.csv_to_dataframe(trending_videos_content)


# In[5]:


print(trending_videos_df.shape)


# In[6]:


trending_videos_df.info()


# In[7]:


trending_videos_df.describe()


# In[8]:


trending_videos_df.describe(include=["object", "bool"])


# In[9]:


class ODSToStageProcessor:
    """
    Processes and cleans YouTube data from ODS (raw) format to a cleaner stage format.
    """
    def __init__(self, category_map: dict = {}):
        self.category_map = category_map

        logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
        self.logger = logging.getLogger(__name__)

    def pt_to_minutes(self, pt_string: str):
        """Convert ISO 8601 duration format (PT format) to minutes"""
        if not isinstance(pt_string, str) or not pt_string.startswith("PT"):
            return 0.0

        match = re.match(r"^PT(\d+H)?(\d+M)?(\d+S)?$", pt_string)
        if match:
            hours = int(match.group(1).replace('H', '') if match.group(1) else 0)
            minutes = int(match.group(2).replace('M', '') if match.group(2) else 0)
            seconds = int(match.group(3).replace('S', '') if match.group(3) else 0)
            return hours * 60 + minutes + (seconds / 60)
        return 0.0

    def trending_ods_to_stage(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Cleans and preprocesses a YouTube trending videos DataFrame for analysis.
        """
        self.logger.info("Started processing trending ODS data.")
        df = df.copy()

        try:
            df.rename(columns={'id': 'video_id'}, inplace=True)
            self.logger.info("Renamed columns successfully.")
        except Exception as e:
            self.logger.error(f"Error renaming columns: {e}")

        try:
            df["publishedAt"] = pd.to_datetime(df["publishedAt"], errors="coerce").dt.strftime('%Y-%m-%d %H:%M:%S')
            self.logger.info("'publishedAt' column converted successfully.")
        except Exception as e:
            self.logger.error(f"Error converting 'publishedAt' column: {e}")

        for col in ["viewCount", "likeCount", "commentCount"]:
            try:
                df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0).astype(int)
                self.logger.info(f"Converted {col} to integers.")
            except Exception as e:
                self.logger.error(f"Error converting {col}: {e}")

        try:
            df["categoryId"] = pd.to_numeric(df["categoryId"], errors="coerce").fillna(0).astype("Int64")
            self.logger.info("'categoryId' column converted successfully.")
        except Exception as e:
            self.logger.error(f"Error converting 'categoryId': {e}")

        df["category_descr"] = df["categoryId"].map(self.category_map).fillna("Unknown")
        self.logger.info("Category mapping completed.")

        if "defaultAudioLanguage" in df.columns:
            df["defaultAudioLanguage"] = df["defaultAudioLanguage"].astype(str).str.upper()
            self.logger.info("Converted 'defaultAudioLanguage' to uppercase.")

        column_order = [
            "video_id", 
            "collection_date", 
            "position", 
            "publishedAt", 
            "title", 
            "channelTitle", 
            "categoryId", 
            "category_descr",
            "viewCount", 
            "likeCount", 
            "commentCount", 
            "defaultAudioLanguage"
        ]

        df = df[[col for col in column_order if col in df.columns] + [col for col in df.columns if col not in column_order]]

        self.logger.info("Completed processing of trending ODS data.")
        return df


    def video_stats_ods_to_stage(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Cleans and preprocesses a YouTube video statistics DataFrame for analysis.
        """
        self.logger.info("Started processing video stats ODS data.")
        df = df.copy()

        try:
            df["published_at"] = pd.to_datetime(df["published_at"], errors="coerce").dt.strftime('%Y-%m-%d %H:%M:%S')
            self.logger.info("'published_at' column converted successfully.")
        except Exception as e:
            self.logger.error(f"Error converting 'published_at' column: {e}")

        for col in ["caption", "licensed_content", "embeddable", "public_stats_viewable"]:
            try:
                df[col] = df[col].astype(bool)
                self.logger.info(f"Converted {col} to boolean.")
            except Exception as e:
                self.logger.error(f"Error converting {col}: {e}")

        for col in ["view_count", "like_count", "comment_count"]:
            try:
                df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0).astype(int)
                self.logger.info(f"Converted {col} to integers.")
            except Exception as e:
                self.logger.error(f"Error converting {col}: {e}")

        if "tags" in df.columns:
            try:
                df["tags"] = df["tags"].apply(lambda x: ", ".join(x) if isinstance(x, list) else str(x))
                self.logger.info("Converted 'tags' column to string.")
            except Exception as e:
                self.logger.error(f"Error processing 'tags' column: {e}")

        if "collection_day" in df.columns:
            df['collection_day'] = pd.to_datetime(df['collection_day'])

        if "duration" in df.columns:
            try:
                df["duration_in_minutes"] = df["duration"].apply(self.pt_to_minutes).round(3)
                self.logger.info("Transformed 'duration' to minutes.")
            except Exception as e:
                self.logger.error(f"Error transforming 'duration' column: {e}")

        column_order = [
            "video_id", 
            "channel_id", 
            "title", 
            "description", 
            "published_at", 
            "tags", 
            "view_count", 
            "like_count", 
            "comment_count", 
            "duration", 
            "duration_in_minutes", 
            "dimension", 
            "definition", 
            "caption", 
            "licensed_content", 
            "projection", 
            "privacy_status", 
            "license", 
            "embeddable", 
            "public_stats_viewable", 
            "topic_categories", 
            "collection_day", 
            "country_code"
        ]

        df = df[[col for col in column_order if col in df.columns] + [col for col in df.columns if col not in column_order]]

        # Sort by video_id and collection_day for correct day-over-day calculations
        df = df.sort_values(by=['video_id', 'collection_day'])

        # Calculate day-over-day changes
        df['daily_view_growth'] = df.groupby('video_id')['view_count'].diff().fillna(0).astype(int)
        df['daily_like_growth'] = df.groupby('video_id')['like_count'].diff().fillna(0).astype(int)
        df['daily_comment_growth'] = df.groupby('video_id')['comment_count'].diff().fillna(0).astype(int)

        self.logger.info("Completed processing of video stats ODS data.")
        return df


# In[10]:


ots_processor = ODSToStageProcessor(category_map=YOUTUBE_CATEGORY_MAP)


# In[11]:


trending_df_stage = ots_processor.trending_ods_to_stage(df=trending_videos_df)


# In[12]:


print(f'There are {trending_df_stage.video_id.nunique()} unique videos collected from trending')


# In[13]:


trending_df_stage.groupby('video_id').agg(
    min_date_at_trending=('collection_date', 'min'),
    max_date_at_trending=('collection_date', 'max'),
    min_trending_position=('trending_position', 'min'),
    max_trending_position=('trending_position', 'max')
)


# ## Videos Statistics Analysis

# In[14]:


loader = LocalDataLoader(file_path="db/ods/merged_video_stats.csv")

video_stats_content = loader.get_csv_file()

video_statistics_df = loader.csv_to_dataframe(video_stats_content)


# In[15]:


video_stats_df_stage = ots_processor.video_stats_ods_to_stage(df=video_statistics_df)


# In[16]:


video_stats_df_stage.info()


# In[17]:


video_stats_df_stage.describe(include=['object', 'bool'])


# In[18]:


print(f'There are {video_stats_df_stage.video_id.nunique()} unique videos collected from video statistics pipeline')


# In[19]:


#print("The trending videos that we can not collect video statistics for are:")
#[x for x in list(trending_df_stage['video_id']) if x not in list(video_stats_df_stage['video_id'])]


# In[20]:


video_stats_df_stage.groupby(['video_id', 'published_at', 'duration_in_minutes']).agg(
    num_stats_collection_days=('collection_day', 'size'),
    min_stats_collection_day=('collection_day', 'min'),
    max_stats_collection_day=('collection_day', 'max'),
    max_num_views=('view_count', 'max'),
    max_num_likes=('like_count', 'max'),
    max_num_comments=('comment_count', 'max')
)


# In[21]:


import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import warnings

class VideoMetricsVisualizer:
    """
    A class for visualizing metrics from YouTube video statistics.
    """

    def __init__(self, df: pd.DataFrame):
        """
        Initialize the VideoMetricsVisualizer with a dataframe of video statistics.

        Parameters:
        -----------
        df : pd.DataFrame
            The dataframe containing video statistics with the required schema
        """
        self.df = df.copy()

        if 'collection_day' in self.df.columns and not pd.api.types.is_datetime64_any_dtype(self.df['collection_day']):
            self.df['collection_day'] = pd.to_datetime(self.df['collection_day'], errors='coerce')

    def plot_video_metrics_over_time(self, video_id: str) -> plt.Figure:
        """
        Plot the view count, like count, and comment count for a specific video_id across collection days.
        """
        video_df = self.df[self.df['video_id'] == video_id].copy()

        if video_df.empty:
            raise ValueError(f"No data found for video_id: {video_id}")

        video_df = video_df.sort_values('collection_day')

        with warnings.catch_warnings():
            warnings.filterwarnings("ignore", category=UserWarning, message=".*missing from current font.*")

            fig, axes = plt.subplots(1, 3, figsize=(18, 6))

            # View Count
            axes[0].plot(video_df['collection_day'], video_df['view_count'], marker='o', linestyle='-', color='blue')
            axes[0].set_title('View Count Over Time')
            axes[0].set_xlabel('Collection Date')
            axes[0].set_ylabel('View Count')
            axes[0].grid(True, alpha=0.3)
            axes[0].xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m-%d'))
            axes[0].tick_params(axis='x', rotation=45)

            # Likes Count
            axes[1].plot(video_df['collection_day'], video_df['like_count'], marker='o', linestyle='-', color='green')
            axes[1].set_title('Like Count Over Time')
            axes[1].set_xlabel('Collection Date')
            axes[1].set_ylabel('Like Count')
            axes[1].grid(True, alpha=0.3)
            axes[1].xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m-%d'))
            axes[1].tick_params(axis='x', rotation=45)

            # Comment Count
            axes[2].plot(video_df['collection_day'], video_df['comment_count'], marker='o', linestyle='-', color='red')
            axes[2].set_title('Comment Count Over Time')
            axes[2].set_xlabel('Collection Date')
            axes[2].set_ylabel('Comment Count')
            axes[2].grid(True, alpha=0.3)
            axes[2].xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m-%d'))
            axes[2].tick_params(axis='x', rotation=45)

            plt.tight_layout(rect=[0, 0, 1, 0.95])

            return fig

    def plot_daily_growth(self, video_id: str) -> plt.Figure:
        """
        Plot the day-over-day change (growth) of views, likes, and comments for a specific video_id.
        """
        video_df = self.df[self.df['video_id'] == video_id].copy()

        if video_df.empty:
            raise ValueError(f"No data found for video_id: {video_id}")

        video_df = video_df.sort_values('collection_day')

        with warnings.catch_warnings():
            warnings.filterwarnings("ignore", category=UserWarning, message=".*missing from current font.*")

            fig, axes = plt.subplots(1, 3, figsize=(18, 6))

            # Daily View Growth
            axes[0].plot(video_df['collection_day'], video_df['daily_view_growth'], marker='o', linestyle='-', color='blue')
            axes[0].set_title('Daily View Growth')
            axes[0].set_xlabel('Collection Date')
            axes[0].set_ylabel('View Growth')
            axes[0].grid(True, alpha=0.3)
            axes[0].xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m-%d'))
            axes[0].tick_params(axis='x', rotation=45)

            # Daily Like Growth
            axes[1].plot(video_df['collection_day'], video_df['daily_like_growth'], marker='o', linestyle='-', color='green')
            axes[1].set_title('Daily Like Growth')
            axes[1].set_xlabel('Collection Date')
            axes[1].set_ylabel('Like Growth')
            axes[1].grid(True, alpha=0.3)
            axes[1].xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m-%d'))
            axes[1].tick_params(axis='x', rotation=45)

            # Daily Comment Growth
            axes[2].plot(video_df['collection_day'], video_df['daily_comment_growth'], marker='o', linestyle='-', color='red')
            axes[2].set_title('Daily Comment Growth')
            axes[2].set_xlabel('Collection Date')
            axes[2].set_ylabel('Comment Growth')
            axes[2].grid(True, alpha=0.3)
            axes[2].xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m-%d'))
            axes[2].tick_params(axis='x', rotation=45)

            plt.tight_layout(rect=[0, 0, 1, 0.95])

            return fig


# In[22]:


video_stats_df_stage.video_id.unique()


# In[23]:


video_stats_visualizer = VideoMetricsVisualizer(video_stats_df_stage)


# In[24]:


video_id = 'CpzMAiDwfHc'


# In[25]:


video_stats_visualizer.plot_video_metrics_over_time(video_id).show()


# In[26]:


video_stats_visualizer.plot_daily_growth(video_id).show()


# In[27]:


video_id = 'dh_LN1Nk5pc'


# In[28]:


video_stats_visualizer.plot_video_metrics_over_time(video_id).show()


# In[29]:


video_stats_visualizer.plot_daily_growth(video_id).show()


# In[ ]:




