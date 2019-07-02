---
layout: post
title: Capture that (Memory) Flag
date: 2019-06-09 18:29
comments: true
external-url:
categories: Software
---

So, yesterday, my friend and PhD student [JP Dias](https://jpdias.me), decided to send me [this .eml file](/assets/analise.eml) [^1] (I'll just put a snippet here; you can download the file using the provided link):

[^1]: For those that complain he should be working on his thesis, I should stress that he has published nothing less than 15 peer-reviewed papers in international avenues during his first two-years o.O 

```
Delivered-To: steg@gmail.com
Received: by 2002:a67:f6da:0:0:0:0:0 with SMTP id v26csp64869vso;
        Fri, 7 Jun 2019 03:57:36 -0700 (PDT)
Date: Fri, 07 Jun 2019 11:57:33 +0100
Message-ID: <20190607115733.Horde.gFe3m_OOi1F27Us_apXwyFf@mail.sapo.pt>
From: oposec@sapo.pt
Subject: =?utf-8?b?QW7DoWxpc2U=?=
User-Agent: IMP PTMail 6.1.13
X-Originating-IP: ::ffff:88.157.29.241
X-PTMail-Version: PTMail 6.1.13
X-PTMail-User: eyJpdiI6InRJL05ZUkZUV29CMHFIQnRMbUdqTXc9PSIsImQiOiJJRU95SWsvTWRIOFpoQkpjL0VEKzJqTFpUbXgyY0g1dWxHUWtmdWFFL09RPSJ9
Content-Type: multipart/mixed; boundary="=_QyDsuBrIdGsWWD2X__fqMsn"
MIME-Version: 1.0
Content-Transfer-Encoding: 8bit

This message is in MIME format.

--=_QyDsuBrIdGsWWD2X__fqMsn
Content-Type: multipart/alternative; boundary="=_8G7a0VyQSrsClgArZ-9Qwj3"
Content-Transfer-Encoding: 8bit

This message is in MIME format.

--=_8G7a0VyQSrsClgArZ-9Qwj3
Content-Type: text/plain; charset=utf-8; format=flowed; DelSp=Yes
Content-Description: Mensagem de Texto
Content-Disposition: inline
Content-Transfer-Encoding: 8bit

Olá,

Preciso de alguém capaz de analisar um PC, será que podes ajudar?

PS: Vamos usar a forma habitual de troca de informações classificadas!

--
A VOLATILIDADE é a constante da vida!

--=_QyDsuBrIdGsWWD2X__fqMsn
Content-Type: image/jpeg; name=banner.jpg
Content-Disposition: attachment; size=94178; filename=banner.jpg
Content-Transfer-Encoding: base64

/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsK
CwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQU
FBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAEcA7YDAREA

[...]

--=_QyDsuBrIdGsWWD2X__fqMsn--
```

*You are going to enjoy it*, he said, just minutes after I tweeted this naive obfuscation of a javascript program:

```
[]["f"+([!1]+[][[]])["10"]+"lter"][([]["f"+([!1]+[][[]])["10"]+"lter"]+[])[3]+(!0+[]["f"+([!1]+[][[]])["10"]+"lter"])["10"]+([][[]]+[])[1]+"str"+([][[]]+[])[0]+([]["f"+([!1]+[][[]])["10"]+"lter"]+[])[3]+"t"+(!0+[]["f"+([!1]+[][[]])["10"]+"lter"])["10"]+"r"](([]["f"+([!1]+[][[]])["10"]+"lter"]+[])[3]+(!0+[]["f"+([!1]+[][[]])["10"]+"lter"])["10"]+([][[]]+[])[1]+"s"+(!0+[]["f"+([!1]+[][[]])["10"]+"lter"])["10"]+"le.l"+(!0+[]["f"+([!1]+[][[]])["10"]+"lter"])["10"]+("0false"+""[([]["f"+([!1]+[][[]])["10"]+
"lter"]+[])[3]+(!0+[]["f"+([!1]+[][[]])["10"]+"lter"])["10"]+([][[]]+[])[1]+"str"+([][[]]+[])[0]+([]["f"+([!1]+[][[]])["10"]+"lter"]+[])[3]+"t"+(!0+[]["f"+([!1]+[][[]])["10"]+"lter"])["10"]+"r"])["20"]+(!1+[]["f"+([!1]+[][[]])["10"]+"lter"])["20"]+[2]+"+2"+(!0+[]["f"+([!1]+[][[]])["10"]+"lter"])["20"])();
```

I am not a security researcher; in fact, despite knowing my way around Verilog and FPGAs, have written emulators for a couple of vintage/toy CPUs, and designed a couple of weekend programming languages, I consider myself an *high-level* guy. But, you know, challenge accepted!

---

Type [.EML extension](https://en.wikipedia.org/wiki/Email#Filename_extensions) is well-known and easy to decode, even if you do it by hand. Here is clearly an image encoded in Base64, so let's start there:

```
$> munpack analise.eml
tempdesc.txt: File exists
banner.jpg (image/jpeg)
```

Which gives us:

<img src="/assets/banner.jpg" alt="banner" style="width:100%;"/>

If you have a plain, ordinary image, then you are most probably using plain, ordinary [steganography](https://en.wikipedia.org/wiki/Steganography). There's plenty of steg tools out there, but I was in *laf*-mode, so I just googled for [something-as-a-service™](https://futureboy.us/stegano/decinput.html) and trusted the almighty `guess the payload` option:

```
The payload may be:
  ASCII text

To display, I might suggest using a MIME type of:
  text/plain

"steganoin29952.jpg":
  format: jpeg
  capacity: 4.9 KB
  embedded file "info.txt":
    size: 116.0 Byte
    encrypted: rijndael-128, cbc
    compressed: yes
```

Encrypted, compressed; I don't care. *Computer*, do the work for me... please:

```
0c60fd56872251909cb07a749b03a34a56e1edac  memdmp.zip
https://www.dropbox.com/s/ks30qs78k18lfd0/memdmp.zip?dl=0
```

Ok, so now we have a file; let's [download it](https://www.dropbox.com/s/ks30qs78k18lfd0/memdmp.zip?dl=0), unzip it, and take a quick look:

```
$> du -h memdmp
521M	memdmp
```

So this is probably a memory dump file of a 512M RAM machine. Is there an easy flag here?

```
$> strings memdmp | grep FLAG
Failed to set SPDRP_CONFIGFLAGS of %s error (0x%lx )
Failed to get SPDRP_CONFIGFLAGS of %s error (0x%lx )
PROCESS_FLAG_REBOOTNOTREQUIRED
PROCESS_FLAG_HIDEUI
      SP_FLAG_CABINETCONTINUATION
      HP_FLAG_KERNEL_MODE
PROCESS_FLAG_REBOOTNOTREQUIRED
PROCESS_FLAG_HIDEUI
...
```

Nope, too much information; we are going to to this the hardway. Up until this point, I thought that the sentence *"A VOLATILIDADE é a constante da vida!"* was something hinting to a password:

```
$> strings memdmp | grep volatilidade
```

But no, nothing relevant. Soon after, JP pointed out there is a forensics tool called [volatility](https://www.volatilityfoundation.org); perfect:

```
$> vol.py -f memdmp imageinfo
Volatility Foundation Volatility Framework 2.6
INFO    : volatility.debug    : Determining profile based on KDBG search...
          Suggested Profile(s) : WinXPSP2x86, WinXPSP3x86 (Instantiated with WinXPSP2x86)
                     AS Layer1 : IA32PagedMemory (Kernel AS)
                     AS Layer2 : FileAddressSpace (/Users/bytter/Downloads/memdmp)
                      PAE type : No PAE
                           DTB : 0x39000L
                          KDBG : 0x8054cde0L
          Number of Processors : 1
     Image Type (Service Pack) : 3
                KPCR for CPU 0 : 0xffdff000L
             KUSER_SHARED_DATA : 0xffdf0000L
           Image date and time : 2019-06-09 16:04:21 UTC+0000
     Image local date and time : 2019-06-09 16:04:21 +0000
```

What an amazing little tool. Let's see what else can we extract from this memdmp:

```
$> vol.py -f memdmp --profile WinXPSP2x86 pstree
Volatility Foundation Volatility Framework 2.6
Name                                                  Pid   PPid   Thds   Hnds Time
-------------------------------------------------- ------ ------ ------ ------ ----
 0x823c89c8:System                                      4      0     54    243 1970-01-01 00:00:00 UTC+0000
. 0x821ad020:smss.exe                                 480      4      3     19 2019-06-09 17:02:15 UTC+0000
.. 0x8222e2a8:winlogon.exe                            604    480     23    519 2019-06-09 17:02:15 UTC+0000
... 0x821d55a8:services.exe                           648    604     15    243 2019-06-09 17:02:15 UTC+0000
.... 0x8225ada0:svchost.exe                          1040    648     78   1525 2019-06-09 16:02:17 UTC+0000
..... 0x821f9130:wuauclt.exe                          256   1040      9    242 2019-06-09 16:02:27 UTC+0000
..... 0x81fd1020:wscntfy.exe                         1444   1040      1     37 2019-06-09 16:02:32 UTC+0000
..... 0x821fba20:wuauclt.exe                         1428   1040      6    118 2019-06-09 16:04:10 UTC+0000
.... 0x82224740:VBoxService.exe                       816    648      8    105 2019-06-09 17:02:15 UTC+0000
.... 0x82176da0:svchost.exe                           948    648      9    243 2019-06-09 16:02:17 UTC+0000
.... 0x81fbf518:alg.exe                               824    648      7    104 2019-06-09 16:02:30 UTC+0000
.... 0x8202aab0:spoolsv.exe                          1596    648     14    110 2019-06-09 16:02:18 UTC+0000
.... 0x8204ec70:svchost.exe                          1088    648      6     83 2019-06-09 16:02:17 UTC+0000
.... 0x821863a0:svchost.exe                           872    648     21    202 2019-06-09 16:02:17 UTC+0000
..... 0x82033658:wmiprvse.exe                         356    872      8    185 2019-06-09 16:03:15 UTC+0000
.... 0x822498b8:svchost.exe                          1148    648     15    197 2019-06-09 16:02:17 UTC+0000
... 0x82217328:lsass.exe                              660    604     25    362 2019-06-09 17:02:15 UTC+0000
.. 0x8225eda0:csrss.exe                               580    480     10    399 2019-06-09 17:02:15 UTC+0000
 0x82188b88:explorer.exe                             1488   1432     14    344 2019-06-09 16:02:18 UTC+0000
. 0x82247d20:cmd.exe                                 1120   1488      1     34 2019-06-09 16:03:45 UTC+0000
.. 0x820573b8:mdd_1.3.exe                            1396   1120      1     24 2019-06-09 16:04:21 UTC+0000
. 0x821a72a8:notepad.exe                             1864   1488      1     39 2019-06-09 16:02:45 UTC+0000
. 0x81fe0910:VBoxTray.exe                             988   1488     11    114 2019-06-09 16:02:30 UTC+0000
. 0x820348f8:ctfmon.exe                              1012   1488      1     69 2019-06-09 16:02:30 UTC+0000
```

Hmmm... There's a couple of interesting processes there. Notepad, VirtualBox, something on the command line. Before we dive into the processes, let inspect easy things like the clipboard:

```
$> vol.py -f memdmp --profile WinXPSP2x86 clipboard

Volatility Foundation Volatility Framework 2.6
Session    WindowStation Format                 Handle Object     Data
---------- ------------- ------------------ ---------- ---------- -----------
         0 WinSta0       CF_UNICODETEXT        0x30115 0xe146f0b8 NOTEPAD
         0 WinSta0       CF_LOCALE            0x5400fb 0xe1b75620
         0 WinSta0       CF_TEXT                   0x1 ----------
         0 WinSta0       CF_OEMTEXT                0x1 ----------

```

Uh! So something from `notepad` resides on the clipboard. What could it be? A password pasted on some input box of a webpage?

```
$> vol.py -f memdmp --profile WinXPSP2x86 editbox
Volatility Foundation Volatility Framework 2.6
******************************
Wnd Context       : 0\WinSta0\Default
Process ID        : 1864
ImageFileName     : notepad.exe
IsWow64           : No
atom_class        : 6.0.2600.5512!Edit
value-of WndExtra : 0xaa708
nChars            : 41
selStart          : 41
selEnd            : 41
isPwdControl      : False
undoPos           : 34
undoLen           : 7
address-of undoBuf: 0xaf7d0
undoBuf           : NOTEPAD
-------------------------


https://bit.ly/31uALei



NOTEPAD
```

Wait a minute. Could that URL contain something? Well, but of course:

```
synt{Z8Z%QHZC%E5PXF!}
```

This... smells... like... something. At this point, JP asked what would be the typical flag format, to which somebody said: `flag{...}`. Wait, this must be it:

```
$> echo "synt{Z8Z%QHZC%E5PXF!}" | tr 'A-Za-z' 'N-ZA-Mn-za-m'
flag{M8M%DUMP%R5CKS!}
```

If you are wondering, `tr 'A-Za-z' 'N-ZA-Mn-za-m'` applies a [ROT13](https://en.wikipedia.org/wiki/ROT13) on the string, a simple letter substitution cipher that replaces a letter with the 13th letter after it. And that was it. We started working on this at 21:22 and finished at 22:47; all while having dinner. Not bad for two amateur hackers :)
