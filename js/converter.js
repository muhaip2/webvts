 /**
     * JavaScript for the converter page
     */
    document.addEventListener("DOMContentLoaded", () => {
      // DOM Elements
      const v2rayToConfigSection = document.getElementById("v2ray-to-config-section")
      const v2rayInput = document.getElementById("v2ray-input")
      const configOutput = document.getElementById("config-output")
      const convertV2rayBtn = document.getElementById("convert-v2ray")
      const copyConfigBtn = document.getElementById("copy-config")
      const loadingIndicator = document.getElementById("loading-indicator")
      const errorMessage = document.getElementById("error-message")
      // Clash configuration options
      const fakeIpBtn = document.getElementById("fake-ip")
      const redirHostBtn = document.getElementById("redir-host")
      const bestPingBtn = document.getElementById("best-ping")
      const loadBalanceBtn = document.getElementById("load-balance")
      const fallbackBtn = document.getElementById("fallback")
      const allGroupsBtn = document.getElementById("all-groups")
      const adsBlockBtn = document.getElementById("ads-block")
      const pornBlockBtn = document.getElementById("porn-block")
      const clashOptionsSection = document.getElementById("clash-options")
      // Download buttons for V2Ray to Config
      const saveProxyProviderBtn = document.getElementById("save-proxy-provider")
      const saveFullConfigBtn = document.getElementById("save-full-config")

      // Configuration type toggle for V2Ray to Config
      const minimalConfigBtn = document.getElementById("minimal-config")
      const fullConfigBtn = document.getElementById("full-config")

      // New: Custom Server / Bug DOM elements
      const customServerToggleBtn = document.getElementById("custom-server-toggle");
      const customServerInputContainer = document.getElementById("custom-server-input-container");
      const customServerInput = document.getElementById("custom-server-input");
      const nonWildcardBtn = document.getElementById("non-wildcard-btn");
      const wildcardBtn = document.getElementById("wildcard-btn");


      // Ensure V2Ray to Config section is always visible and active
      v2rayToConfigSection.classList.remove("hidden")
      hideError()
      toggleClashOptionsVisibility()

      // Event Listener for custom server toggle
      customServerToggleBtn.addEventListener("click", () => {
          customServerToggleBtn.classList.toggle("active");
          if (customServerToggleBtn.classList.contains("active")) {
              customServerInputContainer.style.display = "block";
              // Ensure non-wildcard is active by default when custom server is enabled
              nonWildcardBtn.classList.add("active");
              wildcardBtn.classList.remove("active");
          } else {
              customServerInputContainer.style.display = "none";
              customServerInput.value = ""; // Clear input when disabled
          }
          hideError();
      });

      // Event Listeners for Wildcard/Non-Wildcard toggle
      nonWildcardBtn.addEventListener("click", () => {
          nonWildcardBtn.classList.add("active");
          wildcardBtn.classList.remove("active");
          hideError();
      });

      wildcardBtn.addEventListener("click", () => {
          wildcardBtn.classList.add("active");
          nonWildcardBtn.classList.remove("active");
          hideError();
      });

      // Configuration type toggle for V2Ray to Config
      minimalConfigBtn.addEventListener("click", () => {
        minimalConfigBtn.classList.add("active")
        fullConfigBtn.classList.remove("active")
        hideError()
        // Update download button visibility
        saveProxyProviderBtn.style.display = "flex"
        saveFullConfigBtn.style.display = "none"
        toggleClashOptionsVisibility() // Call the new function
      })
      fullConfigBtn.addEventListener("click", () => {
        fullConfigBtn.classList.add("active")
        minimalConfigBtn.classList.remove("active")
        hideError()
        // Update download button visibility
        saveProxyProviderBtn.style.display = "none"
        saveFullConfigBtn.style.display = "flex"
        toggleClashOptionsVisibility() // Call the new function
      })

      // Toggle DNS mode options
      fakeIpBtn.addEventListener("click", () => {
        fakeIpBtn.classList.add("active")
        redirHostBtn.classList.remove("active")
        hideError()
      })
      redirHostBtn.addEventListener("click", () => {
        redirHostBtn.classList.add("active")
        fakeIpBtn.classList.remove("active")
        hideError()
      })

      // Toggle proxy group options
      bestPingBtn.addEventListener("click", () => {
        bestPingBtn.classList.toggle("active")
        hideError()
      })
      loadBalanceBtn.addEventListener("click", () => {
        loadBalanceBtn.classList.toggle("active")
        hideError()
      })
      fallbackBtn.addEventListener("click", () => {
        fallbackBtn.classList.toggle("active")
        hideError()
      })
      allGroupsBtn.addEventListener("click", () => {
        if (allGroupsBtn.classList.contains("active")) {
          allGroupsBtn.classList.remove("active")
        } else {
          allGroupsBtn.classList.add("active")
          bestPingBtn.classList.add("active")
          loadBalanceBtn.classList.add("active")
          fallbackBtn.classList.add("active")
        }
        hideError()
      })

      // Toggle rule set options
      adsBlockBtn.addEventListener("click", () => {
        adsBlockBtn.classList.toggle("active")
        hideError()
      })
      pornBlockBtn.addEventListener("click", () => {
        pornBlockBtn.classList.toggle("active")
        hideError()
      })

      // Convert V2Ray to Config
      convertV2rayBtn.addEventListener("click", () => {
        const v2rayLinks = v2rayInput.value.trim()
        if (!v2rayLinks) {
          showError("Please enter V2Ray links to convert")
          return
        }
        showLoading()
        setTimeout(() => {
          try {
            const result = convertV2rayToConfig(v2rayLinks)
            configOutput.value = result
            hideLoading()
          } catch (error) {
            hideLoading()
            showError(error.message || "Failed to convert V2Ray links. Please check your input.")
          }
        }, 500)
      })

      // Copy buttons
      copyConfigBtn.addEventListener("click", () => {
        copyToClipboard(configOutput.value)
        copyConfigBtn.innerHTML = '<i class="fas fa-check"></i> Copied!'
        setTimeout(() => {
          copyConfigBtn.innerHTML = '<i class="far fa-copy"></i> Copy'
        }, 2000)
      })

      // Download functions
      function downloadAsYaml(content, filename) {
        // Create a blob with the YAML content
        const blob = new Blob([content], { type: "text/yaml" })
        // Create a URL for the blob
        const url = URL.createObjectURL(blob)
        // Create a temporary link element
        const a = document.createElement("a")
        a.href = url
        a.download = filename
        // Trigger the download
        document.body.appendChild(a)
        a.click()
        // Clean up
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        // Show success toast
        showToast(`File "${filename}" downloaded successfully!`)
      }

      function showToast(message) {
        // Create toast element if it doesn't exist
        let toast = document.getElementById("toast-notification")
        if (!toast) {
          toast = document.createElement("div")
          toast.id = "toast-notification"
          toast.className = "toast-notification"
          toast.innerHTML = `<i class="fas fa-check-circle"></i> <span id="toast-message"></span>`
          document.body.appendChild(toast)
        }
        // Set message and show toast
        document.getElementById("toast-message").textContent = message
        toast.classList.add("show")
        // Hide toast after 3 seconds
        setTimeout(() => {
          toast.classList.remove("show")
        }, 3000)
      }

      // Download buttons for V2Ray to Config
      saveProxyProviderBtn.addEventListener("click", () => {
        const content = configOutput.value
        if (!content) {
          showError("No content to download. Please convert first.")
          return
        }
        // Add timestamp to filename
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-").substring(0, 19)
        downloadAsYaml(content, `proxy_provider_${timestamp}.yaml`)
      })
      saveFullConfigBtn.addEventListener("click", () => {
        const content = configOutput.value
        if (!content) {
          showError("No content to download. Please convert first.")
          return
        }
        // Add timestamp to filename
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-").substring(0, 19)
        downloadAsYaml(content, `inconigto-mode_${timestamp}.yaml`)
      })

      // Helper functions
      function showLoading() {
        loadingIndicator.classList.remove("hidden")
      }
      function hideLoading() {
        loadingIndicator.classList.add("hidden")
      }
      function showError(message) {
        errorMessage.textContent = message
        errorMessage.classList.remove("hidden")
      }
      function hideError() {
        errorMessage.classList.add("hidden")
      }
      async function copyToClipboard(text) {
        try {
          await navigator.clipboard.writeText(text)
          return true
        } catch (err) {
          console.error("Failed to copy: ", err)
          // Fallback method
          const textarea = document.createElement("textarea")
          textarea.value = text
          textarea.style.position = "fixed"
          textarea.style.opacity = "0"
          document.body.appendChild(textarea)
          textarea.select()
          document.execCommand("copy")
          document.body.removeChild(textarea)
          return true
        }
      }

      // Conversion functions
      function convertV2rayToConfig(v2rayLinks) {
        // Split input by lines
        const links = v2rayLinks.split(/\r?\n/).filter((line) => line.trim() !== "")
        if (links.length === 0) {
          throw new Error("No valid V2Ray links found")
        }
        // Process each link
        const parsedLinks = links.map((link) => parseV2rayLink(link))

        // Apply custom server/bug if enabled
        const useCustomServer = customServerToggleBtn.classList.contains("active");
        const customServerValue = customServerInput.value.trim();
        const isWildcardMode = wildcardBtn.classList.contains("active"); // Check if wildcard is active

        if (useCustomServer && customServerValue) {
            parsedLinks.forEach(link => {
                // Store original values before potential modification of 'server'
                const originalSni = link.sni;
                const originalWsHost = link.wsHost;

                link.server = customServerValue; // Always replace server

                if (isWildcardMode) {
                    // For Wildcard mode, append customServerValue to sni, servername, wsHost
                    if (link.type === "vmess" || link.type === "vless" || link.type === "trojan") {
                        if (originalSni && originalSni !== link.server) { // Only append if original SNI exists and is not the same as the original server
                            link.sni = `${customServerValue}.${originalSni}`;
                        } else {
                            link.sni = customServerValue; // If no original SNI or it's just the server, just use custom
                        }
                    }
                    // For SS, wsHost is part of plugin-opts. For other types, wsHost is a direct property.
                    if (link.network === "ws" || link.type === "ss") {
                        if (originalWsHost && originalWsHost !== link.server) { // Only append if original wsHost exists and is not the same as the original server
                            link.wsHost = `${customServerValue}.${originalWsHost}`;
                        } else {
                            link.wsHost = customServerValue; // If no original wsHost or it's just the server, just use custom
                        }
                    }
                }
                // If not wildcard mode, sni, wsHost remain as parsed from original link.
            });
        }

        // Get configuration type
        const isFullConfig = fullConfigBtn.classList.contains("active")
        // Get Clash configuration options
        const useFakeIp = fakeIpBtn.classList.contains("active")
        const useBestPing = bestPingBtn.classList.contains("active")
        const useLoadBalance = loadBalanceBtn.classList.contains("active")
        const useFallback = fallbackBtn.classList.contains("active")
        const useAllGroups = allGroupsBtn.classList.contains("active")
        const useAdsBlock = adsBlockBtn.classList.contains("active")
        const usePornBlock = pornBlockBtn.classList.contains("active")

        // Only generates Clash config
        return generateClashConfig(parsedLinks, isFullConfig, {
          useFakeIp,
          useBestPing,
          useLoadBalance,
          useFallback,
          useAllGroups,
          useAdsBlock,
          usePornBlock,
        })
      }

      function parseV2rayLink(link) {
        try {
          // Determine protocol
          if (link.startsWith("vmess://")) {
            return parseVmessLink(link)
          } else if (link.startsWith("vless://")) {
            return parseVlessLink(link)
          } else if (link.startsWith("trojan://")) {
            return parseTrojanLink(link)
          } else if (link.startsWith("ss://")) {
            return parseShadowsocksLink(link)
          } else {
            throw new Error(`Unsupported protocol in link: ${link}`)
          }
        } catch (error) {
          console.error("Error parsing link:", error)
          throw new Error(`Failed to parse link: ${link}`)
        }
      }

      function parseVmessLink(link) {
        // Remove vmess:// prefix and decode base64
        const base64Content = link.replace("vmess://", "")
        let config
        try {
          const decodedContent = atob(base64Content)
          config = JSON.parse(decodedContent)
        } catch (error) {
          throw new Error("Invalid VMess link format")
        }
        return {
          type: "vmess",
          name: config.ps || "VMess Server",
          server: config.add,
          port: Number.parseInt(config.port),
          uuid: config.id,
          alterId: Number.parseInt(config.aid || "0"),
          cipher: config.scy || "auto",
          tls: config.tls === "tls",
          network: config.net || "tcp",
          wsPath: config.path || "",
          wsHost: config.host || "",
          sni: config.sni || config.add,
          skipCertVerify: true,
        }
      }

      function parseVlessLink(link) {
        // Format: vless://uuid@server:port?params#name
        try {
          // Remove vless:// prefix
          const content = link.replace("vless://", "")
          // Split into parts
          const [userInfo, rest] = content.split("@")
          const [serverPort, paramsAndName] = rest.split("?")
          const [server, port] = serverPort.split(":")
          // Parse params and name
          const params = {}
          let name = ""
          if (paramsAndName) {
            const [paramsStr, encodedName] = paramsAndName.split("#")
            name = encodedName ? decodeURIComponent(encodedName) : "VLESS Server"
            // Parse params
            paramsStr.split("&").forEach((param) => {
              const [key, value] = param.split("=")
              params[key] = value ? decodeURIComponent(value) : ""
            })
          }
          return {
            type: "vless",
            name: name,
            server: server,
            port: Number.parseInt(port),
            uuid: userInfo,
            tls: params.security === "tls",
            network: params.type || "tcp",
            wsPath: params.path || "",
            wsHost: params.host || "",
            sni: params.sni || server,
            skipCertVerify: true,
          }
        } catch (error) {
          throw new Error("Invalid VLESS link format")
        }
      }

      function parseTrojanLink(link) {
        // Format: trojan://password@server:port?params#name
        try {
          // Remove trojan:// prefix
          const content = link.replace("trojan://", "")
          // Split into parts
          const [password, rest] = content.split("@")
          const [serverPort, paramsAndName] = rest.split("?")
          const [server, port] = serverPort.split(":")
          // Parse params and name
          const params = {}
          let name = ""
          if (paramsAndName) {
            const [paramsStr, encodedName] = paramsAndName.split("#")
            name = encodedName ? decodeURIComponent(encodedName) : "Trojan Server"
            // Parse params
            paramsStr.split("&").forEach((param) => {
              const [key, value] = param.split("=")
              params[key] = value ? decodeURIComponent(value) : ""
            })
          }
          return {
            type: "trojan",
            name: name,
            server: server,
            port: Number.parseInt(port),
            password: password,
            tls: params.security === "tls" || true, // Trojan usually uses TLS
            network: params.type || "tcp",
            wsPath: params.path || "",
            wsHost: params.host || "",
            sni: params.sni || server,
            skipCertVerify: true,
          }
        } catch (error) {
          throw new Error("Invalid Trojan link format")
        }
      }

      // Update the parseShadowsocksLink function to properly extract path and TLS settings
      function parseShadowsocksLink(link) {
        // Format: ss://base64(method:password)@server:port?params#name
        try {
          // Remove ss:// prefix
          const content = link.replace("ss://", "")
          let userInfo,
            serverPort,
            name,
            params = {}
          // Check if the link contains @ (SIP002 format)
          if (content.includes("@")) {
            const [encodedUserInfo, rest] = content.split("@")
            let serverPortStr, paramsNamePart
            // Check if there are URL parameters
            if (rest.includes("?")) {
              const [serverPortPart, tempParamsNamePart] = rest.split("?")
              serverPortStr = serverPortPart
              paramsNamePart = tempParamsNamePart
            } else {
              // No params, just server:port#name
              const [serverPortPart, encodedName] = rest.split("#")
              serverPortStr = serverPortPart
              name = encodedName ? decodeURIComponent(encodedName) : "SS Server"
            }

            // Parse params and name if paramsNamePart exists
            if (paramsNamePart) {
              const [paramsStr, encodedName] = paramsNamePart.split("#")
              name = encodedName ? decodeURIComponent(encodedName) : "SS Server"
              // Parse params
              paramsStr.split("&").forEach((param) => {
                const [key, value] = param.split("=")
                params[key] = value ? decodeURIComponent(value) : ""
              })
            }

            // Decode user info (method:password)
            try {
              userInfo = atob(encodedUserInfo)
            } catch (e) {
              // If decoding fails, it might be URL encoded
              userInfo = decodeURIComponent(encodedUserInfo)
            }
            serverPort = serverPortStr
          } else {
            // Legacy format: base64(method:password@server:port)
            const [encodedData, encodedName] = content.split("#")
            const decodedData = atob(encodedData)
            // Split into method:password and server:port
            const atIndex = decodedData.lastIndexOf("@")
            userInfo = decodedData.substring(0, atIndex)
            serverPort = decodedData.substring(atIndex + 1)
            name = encodedName ? decodeURIComponent(encodedName) : "SS Server"
          }

          // Parse user info
          const [method, password] = userInfo.split(":")
          // Parse server and port
          const [server, port] = serverPort.split(":")
          return {
            type: "ss",
            name: name,
            server: server,
            port: Number.parseInt(port),
            cipher: method,
            password: password,
            udp: false,
            tls: params.security === "tls" || (params.plugin_opts && params.plugin_opts.includes("tls=1")), // Check for tls in plugin_opts
            wsPath: params.path || (params.plugin_opts ? (params.plugin_opts.match(/path=([^;]+)/) || ["", ""])[1] : ""),
            wsHost: params.host || (params.plugin_opts ? (params.plugin_opts.match(/host=([^;]+)/) || ["", ""])[1] : server),
            sni: params.sni || server,
            skipCertVerify: true,
          }
        } catch (error) {
          console.error("Invalid Shadowsocks link format:", error)
          throw new Error("Invalid Shadowsocks link format")
        }
      }

      // Update the SS section in generateClashConfig to use the correct path and TLS settings
      function generateClashConfig(parsedLinks, isFullConfig = false, options = {}) {
        const {
          useFakeIp = true,
          useBestPing = true,
          useLoadBalance = false,
          useFallback = false,
          useAllGroups = false,
          useAdsBlock = true,
          usePornBlock = true,
        } = options
        let config = `# Clash Configuration\n# Generated by Inconigto-Mode Converter\n# Date: ${new Date().toISOString()}\n`

        if (isFullConfig) {
          config += `port: 7890\nsocks-port: 7891\nallow-lan: true\nmode: rule\nlog-level: info\nexternal-controller: 127.0.0.1:9090\ndns:\n  enable: true\n  listen: 0.0.0.0:53\n  ${useFakeIp ? "enhanced-mode: fake-ip" : "enhanced-mode: redir-host"}\n  nameserver:\n    - 8.8.8.8\n    - 1.1.1.1\n    - https://dns.cloudflare.com/dns-query\n  fallback:\n    - 1.0.0.1\n    - 8.8.4.4\n    - https://dns.google/dns-query\n`
          if (useAdsBlock || usePornBlock) {
            config += `rule-providers:\n`
            if (useAdsBlock) {
              config += `  ⛔ ADS:\n    type: http\n    behavior: domain\n    url: "https://raw.githubusercontent.com/malikshi/open_clash/refs/heads/main/rule_provider/rule_basicads.yaml"\n    path: "./rule_provider/rule_basicads.yaml"\n    interval: 86400\n`
            }
            if (usePornBlock) {
              config += `  🔞 Porn:\n    type: http\n    behavior: domain\n    url: "https://raw.githubusercontent.com/malikshi/open_clash/refs/heads/main/rule_provider/rule_porn.yaml"\n    path: "./rule_provider/rule_porn.yaml"\n    interval: 86400\n`
            }
          }
        }
        config += `proxies:`
        // Add all proxies
        parsedLinks.forEach((link, index) => {
          config += "\n"
          if (link.type === "vmess") {
            config += `  - name: "[${index + 1}]-${link.name}"\n    type: vmess\n    server: ${link.server}\n    port: ${link.port}\n    uuid: ${link.uuid}\n    alterId: ${link.alterId || 0}\n    cipher: ${link.cipher || "auto"}\n    udp: true\n    tls: ${link.tls}\n    skip-cert-verify: ${link.skipCertVerify || true}\n`
            if (link.network === "ws") {
              config += `    network: ws\n    ws-opts:\n      path: ${link.wsPath || ""}\n`
              if (link.wsHost) {
                config += `      headers:\n        Host: ${link.wsHost}\n`
              }
            }
            if (link.tls && link.sni) {
              config += `    servername: ${link.sni}\n`
            }
          } else if (link.type === "vless") {
            config += `  - name: "[${index + 1}]-${link.name}"\n    type: vless\n    server: ${link.server}\n    port: ${link.port}\n    uuid: ${link.uuid}\n    udp: true\n    tls: ${link.tls}\n    skip-cert-verify: ${link.skipCertVerify || true}\n`
            if (link.network === "ws") {
              config += `    network: ws\n    ws-opts:\n      path: ${link.wsPath || ""}\n`
              if (link.wsHost) {
                config += `      headers:\n        Host: ${link.wsHost}\n`
              }
            }
            if (link.tls && link.sni) {
              config += `    servername: ${link.sni}\n`
            }
          } else if (link.type === "trojan") {
            config += `  - name: "[${index + 1}]-${link.name}"\n    type: trojan\n    server: ${link.server}\n    port: ${link.port}\n    password: ${link.password}\n    udp: true\n    skip-cert-verify: ${link.skipCertVerify || true}\n`
            if (link.network === "ws") {
              config += `    network: ws\n    ws-opts:\n      path: ${link.wsPath || ""}\n`
              if (link.wsHost) {
                config += `      headers:\n        Host: ${link.wsHost}\n`
              }
            }
            if (link.sni) {
              config += `    sni: ${link.sni}\n`
            }
          } else if (link.type === "ss") {
            config += `  - name: "[${index + 1}]-${link.name}"\n    server: ${link.server}\n    port: ${link.port}\n    type: ss\n    cipher: ${link.cipher || "none"}\n    password: ${link.password}\n    plugin: v2ray-plugin\n    client-fingerprint: chrome\n    udp: false\n    plugin-opts:\n      mode: websocket\n      host: ${link.wsHost || link.server}\n      path: ${link.wsPath || ""}\n      tls: ${link.tls}\n      mux: false\n      skip-cert-verify: true\n    headers:\n      custom: value\n      ip-version: dual\n      v2ray-http-upgrade: false\n      v2ray-http-upgrade-fast-open: false\n`
          }
        })

        if (isFullConfig) {
          // Create a list of proxy names first to avoid duplication
          const proxyNames = parsedLinks.map((link, index) => `"[${index + 1}]-${link.name}"`)
          config += `\nproxy-groups:\n  - name: "INCONIGTO-MODE"\n    type: select\n    proxies:\n      - SELECTOR\n`
          if (useBestPing) config += `      - BEST-PING\n`
          if (useLoadBalance) config += `      - LOAD-BALANCE\n`
          if (useFallback) config += `      - FALLBACK\n`
          config += `      - DIRECT\n      - REJECT\n`

          // Add SELECTOR group
          config += `  - name: "SELECTOR"\n    type: select\n    proxies:\n      - DIRECT\n      - REJECT\n`
          // Add all proxy names to the SELECTOR group only once
          proxyNames.forEach((name) => {
            config += `      - ${name}\n`
          })

          // Add proxy groups based on options
          if (useBestPing) {
            config += `  - name: "BEST-PING"\n    type: url-test\n    url: http://www.gstatic.com/generate_204\n    interval: 300\n    tolerance: 50\n    proxies:\n`
            // Add all proxy names to the url-test group
            proxyNames.forEach((name) => {
              config += `      - ${name}\n`
            })
          }
          if (useLoadBalance) {
            config += `  - name: "LOAD-BALANCE"\n    type: load-balance\n    url: http://www.gstatic.com/generate_204\n    interval: 300\n    strategy: round-robin\n    proxies:\n`
            // Add all proxy names to the load-balance group
            proxyNames.forEach((name) => {
              config += `      - ${name}\n`
            })
          }
          if (useFallback) {
            config += `  - name: "FALLBACK"\n    type: fallback\n    url: http://www.gstatic.com/generate_204\n    interval: 300\n    proxies:\n`
            // Add all proxy names to the fallback group
            proxyNames.forEach((name) => {
              config += `      - ${name}\n`
            })
          }

          // Add rule groups if needed
          if (useAdsBlock) {
            config += `  - name: "ADS"\n    type: select\n    proxies:\n      - REJECT\n      - DIRECT\n`
            if (useBestPing) config += `      - BEST-PING\n`
            if (useLoadBalance) config += `      - LOAD-BALANCE\n`
            if (useFallback) config += `      - FALLBACK\n`
          }
          if (usePornBlock) {
            config += `  - name: "PORN"\n    type: select\n    proxies:\n      - REJECT\n      - DIRECT\n`
            if (useBestPing) config += `      - BEST-PING\n`
            if (useLoadBalance) config += `      - LOAD-BALANCE\n`
            if (useFallback) config += `      - FALLBACK\n`
          }

          // Add rules
          config += `rules:\n`
          if (useAdsBlock) {
            config += `  - RULE-SET,⛔ ADS,ADS\n`
          }
          if (usePornBlock) {
            config += `  - RULE-SET,🔞 Porn,PORN\n`
          }
          config += `  - IP-CIDR,192.168.0.0/16,DIRECT\n  - IP-CIDR,10.0.0.0/8,DIRECT\n  - IP-CIDR,172.16.0.0/12,DIRECT\n  - IP-CIDR,127.0.0.0/8,DIRECT\n  - MATCH,INCONIGTO-MODE\n`
        }
        return config
      }

      // Function to toggle visibility of Clash Configuration Options
      function toggleClashOptionsVisibility() {
        if (fullConfigBtn.classList.contains("active")) {
          clashOptionsSection.style.display = "block"
        } else {
          clashOptionsSection.style.display = "none"
        }
      }

      // Initialize Clash options visibility on page load
      toggleClashOptionsVisibility()
    })