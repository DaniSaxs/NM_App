import numpy as np
import eel
import sys
import math

sys.path.append("..")
eel.init("data")

@eel.expose
def getAllEqs(data):

    method = data[0]
    itera = data[1]
    A = np.array(data[2])
    b = np.array(data[3])

    D = np.diagflat(np.diag(A));

    L = np.tril(A)

    for k in range(len(L)):
        for i in range(len(L[k])):
            L[k][k] = 0
            L[k][i] *= -1

    U = np.triu(A);

    for k in range(len(L)):
        for i in range(len(L[k])):
            U[k][k] = 0
            U[k][i] *= -1

    solve = np.linalg.solve(A,b)

    listAll = [solve.tolist(), [D.tolist(), L.tolist(), U.tolist()]]

    if(method == 1):
        listAll.append(Jacobi(itera,A,b,D,L,U,solve))
    elif(method == 2):
        listAll.append(Gauss_Seidel(itera,A,b,D,L,U,solve))

    return listAll

def Gauss_Seidel(itera,A,b,D,L,U,solve):

    elements = []

    D_L = np.subtract(D,L)

    D_L_I = np.linalg.inv(D_L)

    T_GS = np.dot(D_L_I,U)

    C_GS = np.dot(D_L_I,b)

    # Imprimir Resultados

    X = [[0]]

    for i in range(len(T_GS[0]) - 1):
        X[0].append(0)

    a = []

    for k in range(itera):
        
        a = []

        for i in range(len(T_GS)):

            x = 0

            for n in range(len(T_GS[i])):

                x += (T_GS[i][n]*X[k][n])

            x += C_GS[i]  

            a.append(round(x[0],5))

        X.append(a)

    # Errores

    E = []
    e = []

    eR = []
    ER = 0

    for k in range(len(X) - 1):

        e = np.subtract(X[k + 1], X[k])
        
        E.append(round(max(abs(e)),5));

    for i in range(len(T_GS)):
        eR.append(np.array([X[len(X) - 1][i]]))

    ER = round(max(abs(np.subtract(solve, eR))).tolist()[0],5)

    # Análisis de Convergencia

    # EDD

    dia = []
    v = 0;
    vals = []

    for k in range(len(A)):

        dia.append(round(abs(A[k][k].tolist()),5))

        v = 0

        for i in range(len(A[k])):

            v += abs(round(abs(A[k][i].tolist()),5))

        v -= dia[k]  

        vals.append(v)

    # Norma Infinito

    elI = 0
    MI = []

    for k in range(len(T_GS)):

        elI = 0

        for i in range(len(T_GS[k])):

            elI += abs(T_GS[k][i])

        MI.append(elI)

    # Radio Espectral

    REM = np.linalg.eigvals(T_GS)

    eigenv = ""
    eigenVRE = []

    for k in range(len(REM)):

        eigenv = str(REM[k]).replace("(","").replace(")","")

        eigenVRE.append(eigenv);

    elements = [D_L.tolist(),D_L_I.tolist(),T_GS.tolist(),C_GS.tolist(),X,E,ER,[dia,vals],[MI,max(MI)],eigenVRE]

    return elements

def Jacobi(itera,A,b,D,L,U,solve):

    D_I = np.linalg.inv(D)

    LPU = L + U

    T_J = np.dot(D_I,LPU)

    C_J = np.dot(D_I,b)

    # Imprimir Resultados

    XJ = [[0]]

    for i in range(len(T_J[0]) - 1):
        XJ[0].append(0)

    aJ = []

    for k in range(itera):
        
        aJ = []

        for i in range(len(T_J)):

            x = 0

            for n in range(len(T_J[i])):

                x += (T_J[i][n]*XJ[k][n])

            x += C_J[i]  

            aJ.append(round(x[0],5))

        XJ.append(aJ)

    # Errores

    EJ = []
    eJ = []

    eRJ = []
    ERJ = 0

    for k in range(len(XJ) - 1):

        eJ = np.subtract(XJ[k + 1], XJ[k])
        
        EJ.append(round(max(abs(eJ)),5))
    
    for i in range(len(T_J)):
        eRJ.append(np.array([XJ[len(XJ) - 1][i]]))

    ERJ = round(max(abs(np.subtract(solve, eRJ))).tolist()[0],5)

    # Análisis de Convergencia

    # EDD

    diaJ = []
    vJ = 0;
    valsJ = []

    for k in range(len(A)):

        diaJ.append(round(abs(A[k][k].tolist()),5))

        vJ = 0

        for i in range(len(A[k])):

            vJ += abs(round(abs(A[k][i].tolist()),5))

        vJ -= diaJ[k]  

        valsJ.append(vJ)

    # Norma Infinito

    elIJ = 0
    MIJ = []

    for k in range(len(T_J)):

        elIJ = 0

        for i in range(len(T_J[k])):

            elIJ += abs(T_J[k][i])

        MIJ.append(elIJ)

    # Radio Espectral

    REMJ = np.linalg.eigvals(T_J)

    eigenvJ = 0
    eigenVREJ = []

    for k in range(len(REMJ)):

        eigenvJ = str(REMJ[k]).replace("(","").replace(")","")
            
        eigenVREJ.append(eigenvJ)

    elements = [D_I.tolist(),LPU.tolist(),T_J.tolist(),C_J.tolist(),XJ,EJ,ERJ,[diaJ,valsJ],[MIJ,max(MIJ)], eigenVREJ]

    return elements

# Ajuste de Curvas

@eel.expose
def getAllCurves(data):

    grade2List = []

    try:
        grade2List = grade2(data)
    except:
        grade2List = ["Error"]

    try:
        listAll = [dataInfo(data),grade1(data),grade2List,exponential(data)]
    except:
        listAll = ["Error!"]
    
    return listAll


# XY = [[4,102.56],[4.2,113.18],[4.5,130.11],[4.7,142.05],[5.1,167.53],[5.5,195.14],[5.9,224.87],[6.3,256.73],[6.8,299.5],[7.1,326.72]]

def dataInfo(XY):

    elements = []

    x_i = []
    y_i = []
    x_i_2 = []
    x_iy_i = []
    x_i_3 = []
    x_i_4 = []
    x_i_2y_i = []
    lny_i = []
    x_ilny_i = []

    for i in range(len(XY)):
        x_i.append(XY[i][0])
        y_i.append(XY[i][1])
        x_i_2.append(XY[i][0]**2)
        x_iy_i.append(XY[i][0]*XY[i][1])
        x_i_3.append(XY[i][0]**3)
        x_i_4.append(XY[i][0]**4)
        x_i_2y_i.append((XY[i][0]**2)*XY[i][1])
        lny_i.append(math.log(XY[i][1]))
        x_ilny_i.append(XY[i][0]*math.log(XY[i][1]))

    elements = [XY]

    elements.append([x_i,y_i,x_i_2,x_iy_i,x_i_3,x_i_4,x_i_2y_i,lny_i,x_ilny_i])

    Sumx_i = 0
    Sumy_i = 0
    Sumx_i_2 = 0
    Sumx_iy_i = 0
    Sumx_i_3 = 0
    Sumx_i_4 = 0
    Sumx_i_2y_i = 0
    Sumlny_i = 0
    Sumx_ilny_i = 0

    for i in range(len(XY)):
        Sumx_i += x_i[i]
        Sumy_i += y_i[i]
        Sumx_i_2 += x_i_2[i]
        Sumx_iy_i += x_iy_i[i]
        Sumx_i_3 += x_i_3[i]
        Sumx_i_4 += x_i_4[i]
        Sumx_i_2y_i += x_i_2y_i[i]
        Sumlny_i += lny_i[i]
        Sumx_ilny_i += x_ilny_i[i]

    elements.append([Sumx_i,Sumy_i,Sumx_i_2,Sumx_iy_i,Sumx_i_3,Sumx_i_4,Sumx_i_2y_i,Sumlny_i,Sumx_ilny_i])

    return elements

def grade1(data):

    n = len(dataInfo(data)[0])

    m = ((n*dataInfo(data)[2][3])-(dataInfo(data)[2][1]*dataInfo(data)[2][0]))/((n*dataInfo(data)[2][2])-(dataInfo(data)[2][0]**2))
    b = ((dataInfo(data)[2][2]*dataInfo(data)[2][1])-(dataInfo(data)[2][0]*dataInfo(data)[2][3]))/((n*dataInfo(data)[2][2])-(dataInfo(data)[2][0]**2))
    
    return [m,b]

def grade2(data):

    n = len(dataInfo(data)[0])

    A = []
    b = []
    # Ecuacion 1
    A.append([n,dataInfo(data)[2][0],dataInfo(data)[2][2]])
    b.append([dataInfo(data)[2][1]])
    # Ecuacion 2
    A.append([dataInfo(data)[2][0],dataInfo(data)[2][2],dataInfo(data)[2][4]])
    b.append([dataInfo(data)[2][3]])
    # Ecuacion 3
    A.append([dataInfo(data)[2][2],dataInfo(data)[2][4],dataInfo(data)[2][5]])
    b.append([dataInfo(data)[2][6]])
    
    solveEqSys = np.linalg.solve(A,b)

    return solveEqSys.tolist()

def exponential(data):

    n = len(dataInfo(data)[0])

    b = ((n*dataInfo(data)[2][8])-(dataInfo(data)[2][7]*dataInfo(data)[2][0]))/((n*dataInfo(data)[2][2])-(dataInfo(data)[2][0]**2))
    lna = ((dataInfo(data)[2][2]*dataInfo(data)[2][7])-(dataInfo(data)[2][0]*dataInfo(data)[2][8]))/((n*dataInfo(data)[2][2])-(dataInfo(data)[2][0]**2))

    a = math.exp(lna)
    
    return [a,b]

eel.start("index.html", size=(400,400))