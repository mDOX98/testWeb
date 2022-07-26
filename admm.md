[main](index.md)

# ADMM Explanation

## Table of Contents
- [ADMM Explanation](#admm-explanation)
  - [Table of Contents](#table-of-contents)
- [Introduction](#introduction)
- [Math](#math)
  - [ADMM Implementation](#admm-implementation)
- [Derivation of Explicit Custom ADMM](#derivation-of-explicit-custom-admm)
  - [ADMM Iterative Steps](#admm-iterative-steps)
  - [Solving $(A^{*}A+\rho I)^{-1}$](#solving-aarho-i-1)
  - [Solving $(A^{*}b + \rho z_{n} - y_{n})$](#solving-ab--rho-z_n---y_n)
  - [Exeplicit Solution for $x_{n+1}$](#exeplicit-solution-for-x_n1)
  - [Soft Threshholding](#soft-threshholding)
  - [Final ADMM implementation](#final-admm-implementation)

# Introduction

This page covers the math involved in determining the simultaneously aquired sparse changes in the image due to heating.  All math is done under the assumption that both images are aquired simultaneously and that one image is smeared.  Small perterbations have to be accurate to the slice that they reside in and remain consistent when smeared into the other slice due to smearing duality.  

# Math

The cost function that we seek to minimize is:

$argmin_{x}\space||A\mathbf{}x - b||_{2}^{2} + ||x||_{1}$
 
Where

* $A = \begin{bmatrix}F & SF \end{bmatrix}$, $\text{ also known as the operation matrix}$

  * $F = \text{2d Fourier Transform}$
  * $S = \text{k-Space Smear Matrix}$

* $x = \begin{bmatrix}x_{0} \\ x_{1}  \end{bmatrix}$ ($2nm\text{ x }1$)

  * $x_{0} = \text{Vectorized Slice 0 reconstruction in \textbf{image-space}.}$ ($nm \text{ x } 1$)
  * $x_{1} = \text{Vectorized Slice 1 reconstruction in \textbf{image-space}.}$ ($nm \text{ x } 1$)

* $b = \text{Aquired }n\text{ x }m \text{ data in \textbf{k-space}}$ 

This cost function minimizes the difference between the generated image and the raw scanner data $||A\mathbf{}x - b||_{2}^{2}$ and maintains the sparsity of the temperature focus $||x||_{1}$.


## ADMM Implementation

This cost function can be solved by the ADMM (Alternating Direction Method of Multipliers).  Our specific formulation is known as the LASSO problem, which is appears in different statistics and engineering applications.  Standford released a powerpoint slide showing explicit solutions for various ADMM cost functions [here](https://web.stanford.edu/class/ee364b/lectures/admm_slides.pdf#Examples).  A list of other ADMM resources can be found [here](https://stanford.edu/~boyd/admm.html).


# Derivation of Explicit Custom ADMM


## ADMM Iterative Steps

The iterative steps for solving the LASSO problem using  the ADMM is given by the equations (pg. 28 [here](https://web.stanford.edu/class/ee364b/lectures/admm_slides.pdf)):  

* $x_{n+1}=(A^{*}A+\rho I)^{-1}(A^{*}b + \rho z_{n} - y_{n})$

* $z_{n+1}=S_{\tiny\dfrac{\lambda}{\rho}\normalsize}(x_{n+1} + \dfrac{y_{n}}{\rho})$

* $y_{n+1}=y_{n} + \rho x_{n+1} -\rho z_{n+1}$

However, calculating the matrix multiplication and inversion in the $x_{n+1}$ step requires unfeasable amounts of memory and computation time. 

## Solving $(A^{*}A+\rho I)^{-1}$


First we must simplify the matrix $(A^{*}A+\rho I)^{-1}$.

We begin by substituting $A = \begin{bmatrix}F & SF\end{bmatrix}$ where $F$ is the 2d-fourier transform and $S$ is  the k-space smear operation.  The left half of the block matrix is just the fourier transform because the top half of the $x$ vector corrosponds to the unsmeared frame being imaged by the MRI.  The right half of the operation incorperates the smear matrix because it represents the smearing in the bottom half of the $x$ vector reconstruction.  

1. $(\begin{bmatrix}F^{*} \\ F^{*}S^{*}\end{bmatrix}\begin{bmatrix}F & SF\end{bmatrix}+\rho I)^{-1}$

Next complete the matrix multiplication of $\begin{bmatrix}F^{*} \\ F^{*}S^{*}\end{bmatrix}\begin{bmatrix}F & SF\end{bmatrix}$.

2. $(\begin{bmatrix}F^{*}F & F^{*}SF \\ F^{*}S^{*}F & F^{*}S^{*}SF\end{bmatrix} + \rho I)^{-1}$

Simplify $F^{*}F$ into $I$ (the identity matrix) and $S^{*}S$ into the identity matrix.

3. $(\begin{bmatrix}I & F^{*}SF \\ F^{*}S^{*}F & I\end{bmatrix} + \rho I)^{-1}$

$\rho I$ runs along the diagonal of $\begin{bmatrix} I & 0 \\ 0 & I\end{bmatrix}$, so we can add the two together.

4. $(\begin{bmatrix}I+\rho & F^{*}SF \\ F^{*}S^{*}F & I+\rho\end{bmatrix})^{-1}$

To make future calculations easier we substitute the constant $q$ for $\rho+1$.

5. $(\begin{bmatrix}qI & F^{*}SF \\ F^{*}S^{*}F & qI\end{bmatrix})^{-1} \space\text{where } q = \rho+1$

To find the inverse of this matrix we use the method described in this [wikipedia page on block matrix inverses](https://en.wikipedia.org/wiki/Block_matrix). 

Block matrices of the form $\begin{bmatrix}A & B \\ C & D\end{bmatrix}$ can be inverted in the following way if $A$ and $D$ are invertible:

$\begin{bmatrix}A & B \\ C & D\end{bmatrix}^{-1} = \begin{bmatrix}(A-BD^{-1}C)^{-1} & 0 \\ 0 & (D-CA^{-1}B)^{-1}\end{bmatrix}\begin{bmatrix}I & -BD^{-1} \\ -CA^{-1} & I\end{bmatrix}$

Start by re-writing our matrix in this form:

6. $(\begin{bmatrix}qI & F^{*}SF \\ F^{*}S^{*}F & qI\end{bmatrix})^{-1}=$

$$
   \begin{bmatrix}(qI-F^{*}SF\dfrac{1}{q}IF^{*}S^{*}F)^{-1} & 0 \\ 0 & (qI-F^{*}S^{*}F\dfrac{1}{q}IF^{*}SF)^{-1}\end{bmatrix}\begin{bmatrix}I & -F^{*}SF\dfrac{1}{q}I \\ -F^{*}S^{*}F\dfrac{1}{q}I & I\end{bmatrix}
   
$$

Move the $\dfrac{1}{q} I$ terms to the outside of the matrix multiplications, then simplify all instances of $F^{*}F$, $FF^{*}$, $S^{*}S$, and $SS^{*}$ into the identity matrix.  Start from the inside and move out:

7. $\begin{bmatrix}(qI-\dfrac{1}{q}I)^{-1} & 0 \\ 0 & (qI-\dfrac{1}{q}I)^{-1}\end{bmatrix}\begin{bmatrix}I & -\dfrac{1}{q}F^{*}SF \\ -\dfrac{1}{q}F^{*}S^{*}F & I\end{bmatrix}$

Simplify $qI- \dfrac{1}{q}I$ to $(q-\dfrac{1}{q})I$.


8. $\begin{bmatrix}((q-\dfrac{1}{q})I)^{-1} & 0 \\ 0 & ((q-\dfrac{1}{q})I)^{-1}\end{bmatrix}\begin{bmatrix}I & -\dfrac{1}{q}F^{*}SF \\ -\dfrac{1}{q}F^{*}S^{*}F & I\end{bmatrix}$

Invert $((q-\dfrac{1}{q})I)^{-1}$ to $\dfrac{1}{q-\dfrac{1}{q}}I$

9. $\begin{bmatrix}\dfrac{1}{q-\dfrac{1}{q}}I & 0 \\ 0 & \dfrac{1}{q-\dfrac{1}{q}}I\end{bmatrix}\begin{bmatrix}I & -\dfrac{1}{q}F^{*}SF \\ -\dfrac{1}{q}F^{*}S^{*}F & I\end{bmatrix}$

Multiply the matrices together.

10. $\begin{bmatrix}\dfrac{1}{q-\dfrac{1}{q}}I & -\dfrac{1}{q}\dfrac{1}{q-\dfrac{1}{q}}F^{*}SF \\ -\dfrac{1}{q}\dfrac{1}{q-\dfrac{1}{q}}F^{*}S^{*}F & \dfrac{1}{q-\dfrac{1}{q}}I\end{bmatrix}$

Substitute
$d_{0}=\dfrac{1}{q-\dfrac{1}{q}}$ , $d_{1}=-\dfrac{1}{q}\dfrac{1}{q-\dfrac{1}{q}}$


11. $(A^{*}A+\rho I)^{-1}=\begin{bmatrix}d_{0}I & d_{1}F^{*}SF \\ d_{1}F^{*}S^{*}F & d_{0}I\end{bmatrix}$


---
## Solving $(A^{*}b + \rho z_{n} - y_{n})$

Next we simplify $(A^{*}b+\rho z_{n} - y_{n})$

1. $(A^{*}b+\rho z_{n} - y_{n})=\begin{bmatrix}F^{*} \\ F^{*}S^{*}\end{bmatrix}b + \rho z_{n} - y_{n}$ 

Next we define $\begin{bmatrix}c_0 \\ c_1\end{bmatrix}$ for later matrix multiplications.

$\begin{bmatrix}c_0 \\ c_1\end{bmatrix} =\begin{bmatrix}F^{*} \\ F^{*}S^{*}\end{bmatrix}b + \rho z_{n} - y_{n} =(A^{*}b+\rho z_{n} - y_{n})$ 

---

## Exeplicit Solution for $x_{n+1}$


1. $x_{n+1}=(A^{*}A+\rho I)^{-1}(A^{*}b+\rho z_{n} - y_{n})$

Take the solutions from Part 1 and Part 2 and multiply them together.

2. $x_{n+1}=\begin{bmatrix}d_{0}I & d_{1}F^{*}SF \\ d_{1}F^{*}S^{*}F & d_{0}I\end{bmatrix}\begin{bmatrix}c_0 \\ c_1\end{bmatrix}$

3. $x_{n+1}=\begin{bmatrix}d_{0}c_0 + d_{1}F^{*}SFc_{1} \\ d_{0}c_{1}+d_{1}F^{*}S^{*}Fc_{0} \end{bmatrix}$


## Soft Threshholding

Soft threshholding is a way of stopping the solver from working on variables that don't require any more precision than is currently found.  The function is defined as:

$$ S_{a}(v[n]) = 
\begin{cases}
v[n]-a & \quad \text{when $v[n] \gt a$}\\ 
0 & \quad \text{when $-a \lt v[n] \lt a$} \\
v[n]+a & \quad \text{when $v[n] \lt -a$}
\end{cases} $$

Where $a$ is the threshhold constant and $v$ is the input vector.  In practical application the entire vector $v$ is put into thethreshholding function, and it automatically threshholds each element of the vector.


## Final ADMM implementation

* $a_b$ can be pre-calculated as $\begin{bmatrix}F^{*} \\ F^{*}S^{*}\end{bmatrix}b$.  

Every iteration:
* $\begin{bmatrix}c_0 \\ c_1\end{bmatrix} =a_{b} + \rho z_{n} - y_{n}$ 

* $x_{n+1}=\begin{bmatrix}d_{0}c_0 + d_{1}F^{*}SFc_{1} \\ d_{0}c_{1}+d_{1}F^{*}S^{*}Fc_{0} \end{bmatrix}$

* $z_{n+1}=S_{\tiny\dfrac{\lambda}{\rho}\normalsize}(x_{n+1} + \dfrac{y_{n}}{\rho})$

* $y_{n+1}=y_{n} + \rho x_{n+1} -\rho z_{n+1}$







