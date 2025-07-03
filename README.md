# Exosky

**Our project can be explored from this link:** https://nobhoyan.github.io/exosky/

[Note: It might take up to 15 seconds for the page to load properly]

## Introduction
We first started our project for the NASA Space Apps Challenge 2024. Although we were not selected in that event, we realized that our project could be something much, much bigger. It could make astronomy education easier and present it in a mesmerizing way. Thus, we continued working on our project and expanding the reach of Astronomy education to the farthest corners of Bangladesh. If even a single student becomes curious about the vast universe overhead, we call our project a success. 

## Aim
Our goal is to spark curiosity and cultivate a deeper appreciation for astronomy by making space exploration more accessible. Growing up in countries where telescopes are a luxury and light pollution often obscures the beauty of the night sky, WebApps like Stellarium have been invaluable in fueling our fascination with the cosmos. We wanted to take that experience a step further by offering curious high school students like ourselves the chance to explore not only our own planet’s starry nights but also the skies of thousands of exoplanets. By allowing users to create their own constellations in these distant worlds, we aim to make the experience both educational and personal. If our project inspires even one person to explore the vast potential of the universe, we will consider all our efforts a success.

## Project Description
### Hopping Page
Our Web App features two main sections: the Hopping page and the Exosky page. The Hopping page presents a 3D point cloud of 4,302 ExoHosts—stars that host exoplanets—using data from NASA’s Exoplanet Archive. These stars are plotted in 3D space based on their right ascension, declination, and parallax. Star sizes are determined by their radius, while colors are accurately mapped using temperature and BV index, ensuring a realistic and scientifically accurate visualization. Users can freely navigate through this stellar landscape, or search for specific stars using an intuitive search bar. Each star also comes with informative pop-ups, offering fascinating details when clicked.

![image](https://github.com/user-attachments/assets/4bf6949d-c7b2-47e4-8dad-646bcb26e064)

In addition to the stars, exoplanets orbiting these ExoHosts are rendered with custom textures for visual appeal. These planets are modeled using data such as radius, eccentricity, and semimajor axis, ensuring an immersive experience. Similar to the stars, users can click on exoplanets to access detailed information.

### Exosky Page

![image](https://github.com/user-attachments/assets/a948dc1d-8ed4-4b80-b2f1-ed360bf01281)

By double-clicking any exohost, users are seamlessly transported to the Planetarium page, where they can observe the night sky as it appears from the surface of that star's exoplanets. Utilizing data from the Gaia Catalogue and custom algorithms, we’ve ensured that star positions, sizes, and brightness are scientifically accurate. Users can zoom in and out for a closer look, manually set the planet's pole orientation, and access a range of tools to enhance their exploration.

The Tools menu includes options like:
* **Draw Constellation** Create and name custom constellations.
* **Drag & Research** Generate useful graphs, such as the HR Diagram, from selected star regions in the sky.
* **Save as Image** Capture stunning 360-degree panoramic shots.
* **Export as PDF** Create detailed sky charts for further exploration.

To make the experience more engaging, we’ve also integrated an AI chatbot called TaraBhai (or StarBro), designed to assist users of all ages and backgrounds, making the app accessible and educational for everyone.

![image](https://github.com/user-attachments/assets/a9b617e5-94f4-4538-8b64-8d8f080c190a)

Benefits:
* **Educational Value**
  Our platform offers an engaging, hands-on approach to learning about exoplanets, stars, and their properties. Informative cards provide easy-to-understand facts, making astronomy accessible to users of all ages and knowledge levels.
* **Scientific Exploration**
  Features like constellation drawing and the ability to generate research graphs, such as Hertzsprung-Russell (HR) diagrams, allow users to interact with astronomical data in a way typically reserved for professional astronomers, fostering deeper scientific exploration.
* **Visual Appeal**
  The website’s scientifically accurate renderings, enhanced with visually stunning hypothetical textures, create a captivating experience that immerses users in the beauty of the cosmos.
* **Customization**
  Users can customize their experience by setting the planet’s pole orientation, generating sky charts, and even creating personalized constellations, making the platform a versatile tool for both casual stargazers and hobbyist astronomers.
* **Accessibility** 
  Building this website using Three.js has allowed us to optimize performance across a range of devices, ensuring smooth functionality even on low-spec computers, laptops, and smartphones. This approach makes the platform highly accessible, allowing a broader audience to engage with it without the need for high-end hardware.
* **User Friendliness**
  The AI chatbot TaraBhai, developed using Google Gemini, enhances the platform’s interactivity by serving as a user-friendly guide, making the experience inclusive and intuitive for users of all ages and backgrounds.


## Tools we used
To build the WebApp, we used **HTML**, **CSS**, **Bootstrap** and **JavaScript**, with a particular focus on the **Three.js** library to render the stars and planets in both the Hopping page and the interactive Planetarium. 

For our chatbot, *TaraBhai*, we integrated Google Gemini's API to enhance user interaction. 

We used **NASA Exoplanets Archive** for exoplanet data. We processed the data using **Python**. **Astroquery** module was used to get Gaia data for each ExoHost. The data was processed in **Google Colab** on a **Google Cloud Compute Engine**


## Data Generation Process
1. The data of 5735 exoplanets from NASA Exoplanets Archive were grouped into 4302 host systems, or ExoHosts, as we call it. The reason is that the night sky is the same for all planets in a host system. This data was used in the "Hopping" page to both locate the ExoHosts, and also show the data of the stars and their exoplanets. 

2. For each ExoHost, we followed the process in the following flow chart to generate the stars seen in the "Planetarium" page. With our limited resources, we had to make a trade-off between accuracy and computation time, as loading time from the Gaia archive increased a lot with the number of stars we analyzed for each ExoHost. So, we developed an algorithm as efficient as possible and ran 10 different sessions in parallel to speed up the process.

![image](https://github.com/user-attachments/assets/f343a2b3-5c09-4cbb-bf07-976d5e0db59f)

As depicted in the flow chart, we put distance constraint as the number of visible stars are inversely proportional to distance, but the total number of stars increased as we increased the distance. 

![image](https://github.com/user-attachments/assets/8fa5b7be-a24f-4475-8242-3a3c224bfc34)

3. We used the following equations to calculate each star's relative data from the ExoHost:

![image](https://github.com/user-attachments/assets/edc181e8-220e-4e2d-8e51-969747c14f25)

NotationThe first equation is the spherical cosine law for calculating the angular distance, theta between the ExoHost and a star. This angular distance is used to calculate the relative distance and magnitude of the star using the second and the third equations, respectively.

We calculated the cartesian coordinates of the star from the ExoHost's reference frame using equation four. Because of this equation, the x-axis, i.e., the (ra, dec) = (0,0) line and the default rotational axis are parallel to Earth's for every exoplanet. The final equation calculates the relative right ascension and declination of the star.

4. For each ExoHost, we plotted 720 stars with galactic latitudes between +0.00001 and - 0.00001 degrees and determined the best-fit curve using scipy module's curve_fit function for the following function. For simplicity, we assumed galactic longitude=0 for those stars. 

![image](https://github.com/user-attachments/assets/2fa96de9-0812-4d33-8bd3-f3f6973c01c4)

For Earth, the stars follows the galactic equator line. Considering near disk-shape of our galaxy and the Sun being near the disk's center of thickness, we used this solution to accurately plot the galactic line of the galactic equator for the ExoHosts.

![image](https://github.com/user-attachments/assets/2090a5db-7ce0-4c6c-b5fd-23074912ee42)
### Team
**'N'afiul Haque - Team Leader, Front-end & Back-end Developer** <br/>
**Hritom Sarker 'O'yon - Researcher** <br/>
**'B'ayezid Bostami - Data Anaylist** <br/>
**'H'asib Khan - Back-end Developer** <br/>
**Shams Khan 'O'mik - Front-end Developer** <br/>
**'Yan'na Lorraine - Designer**
