# Heatmap - Visual Analysis Tool for Educational Feedback

> Supervisor: Prof. Melo Júnior
>
> Developer: João Victor Alves
> 
> Designer: Deivid Salvino
> 
This project involves creating a visual analysis tool designed for assessing educational feedback data, focusing on correlations between `students x questions`. This tool is a crucial part of an educational system at the Center for Excellence and Educational Policies (CEnPE) at UFC, where I serve as a research fellow and developer.

![image](https://github.com/joaoVictorBAlves/devolutivas-educacionais-cenpe/assets/86852231/a63b0174-56b7-438e-8840-10810e4ca264)

## Functionalities

This tool allows the loading of tabular CSV data containing student-question results and facilitates sorting and clustering. These functionalities assist in identifying both the best and worst cases for both questions and students. This process is implemented through the following functions:

- `runDataset()`: Initializes the dataset with random values between 0, 1, and 2.
- `sortDatasetLines()`: Sorts the dataset's rows, allowing both ascending and descending order.
- `sortDatasetColumns()`: Sorts the dataset's columns, allowing both ascending and descending order.
- `sortMatrixVertical()`: Sorts the matrix based on a factor count vertically.
- `sortMatrixHorizontal()`: Sorts the matrix based on a factor count horizontally.
- `sortAndAgroupedLines()`: Sorts and groups the dataset's rows using the best or worst order.
- `sortAndAgroupedColumns()`: Sorts and groups the dataset's columns using the best or worst order.

## Theoretical Foundations

This code is based on pixel-oriented visualization techniques as described in the article "Designing Pixel-Oriented Visualization Techniques: Theory and Applications" by Daniel A. Keim.

The original article can be found [here](https://ieeexplore.ieee.org/document/841121).
