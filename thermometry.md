<head>
    <script src="https://cdn.jsdelivr.net/npm/p5@1.4.2/lib/p5.js"></script>
    
</head>

[main](index.md)

# Thermometry

## Table of Contents

- [Thermometry](#thermometry)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Calculating Temperature](#calculating-temperature)
  - [Temperature Range](#temperature-range)
  - [Vector Representation](#vector-representation)
  - [Noise](#noise)
  - [Examples](#examples)


## Introduction

There are multiple thermometry method's that can be used to process MR images into useful temperature maps.  The method used in clinical practice is the [proton resonance frequency method](https://qims.amegroups.com/article/view/119/154).  Advantages of this method include linearity, computation speed, and accuracy. 


## Calculating Temperature

The proton resonance frequency (PRF) method cannot calculate absolute temperature. It can only calculate a change in temperature between two MR images.  

The change in temperature $\Delta T$ in celsuis can be calculated by useing the following equation.

$\Delta T = c_t\Delta \theta$| where $c_t$ is the temperature radian ratio and $\Delta \theta$ is the change in phase angle between the current image and the baseline.

This can be better seen in this equation 

$\Delta T = c_t(\theta_{1}-\theta_{0})$| where $\theta_{1}$ is the phase angle of the current image and $\theta_{0}$ which is the phase angle of the baseline.

## Temperature Range

This method can only calculate temperature in the range $(-c_t \pi , c_t\pi)$.  If $\Delta \theta$ is larger than $\pi$ or smaller than $-\pi$, the PRF method will fail.  

## Vector Representation

It is often helpful to think of each pixel as a complex number, which is a 2-d vector on the real-imaginary plane.  


<div id="sketch-holder">
    <script src="thermometry_1.js"></script>
</div>


## Noise

This method cannot differentiate between a temperature focal region and noise present in the MRI.  A higher SNR lessens the effects of noise.


## Examples