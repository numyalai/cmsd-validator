function validateStreamingFormat(format) {
  const tokens = format.match(/\((.*?)\)/);
  if (!tokens) {
    // No tokens found, format is invalid or unknown
    return false;
  }
  const expectedTokens = ["d", "h", "s"];
  const extractedTokens = tokens[1].split(" ");
  // Check if all extracted tokens are valid
  return extractedTokens.every(
    (token) => expectedTokens.includes(token) || token === "o"
  );
}

function validateNRR(nrrValue) {
  const rangeRegex = /(\d+)-(\d+)/;
  const match = nrrValue.match(rangeRegex);
  if (!match) {
    // Invalid range format
    return false;
  }
  const start = parseInt(match[1]);
  const end = parseInt(match[2]);
  if (isNaN(start) || isNaN(end)) {
    // Invalid start or end value
    return false;
  }
  // Additional validation constraints can be applied here if needed
  return true;
}

function validateKeyValue(key, value) {
  // Main
  if (key == "at") {
    // Check if value is a number (value is a string)
    return !isNaN(value);
  }
  if (key == "br") {
    return !isNaN(value);
  }

  if (key == "ht") {
    /*
      Integer Milliseconds
      The number of milliseconds that this response
      was held back by an origin before returning.
      This is applicable to blocking responses under
      LL-HLS [HLSbis].
      */
    return !isNaN(value);
  }
  if (key == "n") {
    /* 
      String
      An identifier for the processing server. The
      value SHOULD identify both the organization
      and the intermediary that is writing the key.
      Identifiers SHOULD be as concise as possible
      to reduce log file and transferred size, while
      still remaining unique. 
      */
    return typeof value == "string";
  }
  if (key == "nor") {
    /* 
          Vertical line
          [Unicode 0x7C]
          delimited string
          The URL-encoded relative path to one or more
          objects which can reasonably be expected to
          be requested by a media client consuming the
          current response. This key will typically be
          added by the origin. An intermediate server
          MAY use this key to perform a prefetch action.
          In the case of redirects, this path is relative to
          the final request. Each object SHOULD be
          fetched in its entirety unless a matching ‘nrr’
          entry exists for that list element. Special care
          must be taken to percent-encode the "|"
          character if it appears in the path.
      */
    return typeof value == "string" && value.includes("|");
  }
  if (key == "nrr") {
    /*
      Vertical line
      [Unicode 0x7C]
      delimited string of
      ranges in the form
      "<range-start>-
      <range-end>"
      If the next response will be a partial object
      response, then this string denotes the byte
      range that will be returned. If the ‘nor’ field is
      not set, then the object is assumed to match
      the object currently being served. Formatting
      is similar to the HTTP Range header, except
      that the unit MUST be ‘byte’, the ‘Range:’
      prefix is NOT required, specifying multiple
      ranges is NOT allowed and the only valid form
      is "<range-start>-<range-end>"
      */
    return validateNRR(value);
  }
  if (key == "d") {
    /*
      Integer in
      milliseconds
      The playback duration in milliseconds of the
      object. If the value of playback duration is not
      known accurately, this parameter MUST be
      omitted. This key MUST NOT be used in
      responses to range requests against objects
      */
    return !isNaN(value);
  }
  if (key == "ot") {
    /*
      Token - one of
      [m,a,v,av,i,c,tt,k,o] 
      The media role of the current object being
      returned:
      m = text file, such as a manifest or playlist
      a = audio only
      v = video only
      av = muxed audio and video
      i = init segment
      c = caption or subtitle
      tt = ISOBMFF timed text track
      k = cryptographic key, license or certificate.
      o = other
      It is assumed that the server adding this key
      knows the object role. If not, then this key
      MUST NOT be used.
      */
    return (
      value == "m" ||
      value == "a" ||
      value == "v" ||
      value == "av" ||
      value == "i" ||
      value == "c" ||
      value == "tt" ||
      value == "k" ||
      value == "o"
    );
  }
  if (key == "su") {
    /*
      Boolean
      If used, Key MUST be included without a value
      if the object is needed for startup of the
      stream. This key MUST NOT be sent if it is
      FALSE. The threshold of startup is left to the
      determination of the origin. It should
      approximate the starting buffer of the
      intended players.
      */
    return value == "true" || value == "false";
  }
  if (key == "st") {
    /*
          Token - one of [v,l] 
          v = all segments are available – e.g., VoD.
          l = segments become available over time –
          e.g., live. This state information SHOULD be
          trusted for no longer than the cache time of
          the object. 
      */
    return value == "v" || value == "l";
  }
  if (key == "sf") {
    /*
          Inner list of tokens -
          ([d h s o])
          The streaming format that defines the current
          response.
          d = MPEG DASH
          h = HTTP Live Streaming (HLS)
          s = Smooth Streaming
          o = other
          If the streaming format being returned is
          unknown, then this key MUST NOT be used. If
          the object is serving multiple streaming
          formats (such as a CMAF container for HLS
          and DASH), then the inner-list SHOULD
          contain both target formats – e.g., (d h).
      */
    return validateStreamingFormat(value);
  }
  if (key == "v") {
    /*
          Integer
          The version of this specification used for
          interpreting the defined key names and
          values. If this key is omitted, any recipients
          MUST interpret the values as being defined by
          version 1. A server SHOULD omit this field if
          the version is 1.
      */
    return !isNaN(value);
  }
  // Identifier
  if (key == "du") {
    /*
      Boolean
      Key is included without a value if the server is
      under duress, due to cpu, memory, disk IO,
      network IO or other reasons. The thresholds
      for signaling duress are left to the discretion
      of the server operator. The intent is that the
      client will use this signal to move away to an
      alternate server if possible. This key MUST
      NOT be sent if it is false.
      */
    return value == "true" || value == "false";
  }
  if (key == "etp") {
    /* 
       Integer Kbps
       The throughput between the server and the
          client over the currently negotiated transport
          as estimated by the server at the start of the
          response. The value is expressed in units of
          kilobits per second and rounded to the
          nearest integer. The time window for this
          estimate is expected to be the duration of the
          current response at most. The throughput
          may vary during the response and the client
          SHOULD use this data as an adjunct to its own
          throughput estimates. As an informative
          example, this estimate could be derived in this
          way:
          etp = 8 * send_window / (rtt)
          where send_window = min (cwnd * mss,
          rwnd) with Congestion Window (cwnd)
          measured in packets, Maximum Segment Size
          (mss) in bytes, Receiver Window (rwnd) in
          bytes and rtt in milliseconds. Note that
          multiple client processes adjacent to the
          media player may pool their requests into the
          same connection to the server. In this case the
          server estimate of throughput will be against
          the entirety of the connection, not all of which
          will be accessible to the media player. 
      */
    return !isNaN(value);
  }
  if (key == "mb") {
    /* 
          Integer Kbps
          The maximum bitrate value that the player
          SHOULD play in its Adaptive Bit Rate (ABR)
          ladder. If the player is playing a bitrate higher
          than this value, it SHOULD immediately switch
          to a bitrate lower than or equal to this value
      */
    return !isNaN(value);
  }
  if (key == "rd") {
    /*
      Integer milliseconds 
      The time elapsed between the receipt of the
      request and when the first byte of the body
      becomes available to send to the client. The
      intention is for receivers to use this value to
      more accurately calculate the throughput of
      the connection [MHV22]. 
      */
    return !isNaN(value);
  }
  if (key == "rtt") {
    /*
          Integer milliseconds
          Estimated round trip time between client and
          server. This estimate may be derived from the
          transport handshake. For subsequent requests
          over the same connection, the value can be
          refined to be an exponentially weighted
          moving average of prior instantaneous values.
          An informative example algorithm for this
          averaging is provided by [18].
      */
    return !isNaN(value);
  }

  return true;
}

function parseHeaders(headersString) {
  const headersArray = headersString.split("\r\n");
  const headersObj = {};

  headersArray.forEach((header) => {
    const [key, ...valueParts] = header.split(": ");
    const value = valueParts.join(": "); // Reconstruct the original value (it may contain ':')
    headersObj[key] = value;
  });

  return headersObj;
}

const CMSDValidator = (header) => {
  if (!header) {
    console.log("No header provided");
    return false;
  }
  try {
    const headersJSON = parseHeaders(header);
    console.log("Headers parsed successfully, validating...", headersJSON);
    // Parse cmsd-dynamic value
    const cmsdDynamicValue = headersJSON["cmsd-dynamic"];
    const modifiedCmsdDynamicValue = cmsdDynamicValue.replace(/\\"/g, '"');
    const cmsdDynamicObject = {};
    modifiedCmsdDynamicValue.split(";").forEach((pair) => {
      const [key, value] = pair.split("=");
      cmsdDynamicObject[key] = value;
    });

    console.log(cmsdDynamicObject);
    // validate each key in the cmsdDynamicObject
    Object.keys(cmsdDynamicObject).forEach((key) => {
      if (!validateKeyValue(key, cmsdDynamicObject[key])) {
        results.push({
          status: "error",
          key: key,
          value: cmsdDynamicObject[key],
          type: "dynamic",
        });
        console.log(
          "Invalid key-value pair: " + key + "=" + cmsdDynamicObject[key]
        );
      } else {
        results.push({
          valid: false,
          key: key,
          value: cmsdDynamicObject[key],
          type: "dynamic",
        });
      }
    });
    // Parse cmsd-static value
    const cmsdStaticValue = headersJSON["cmsd-static"];
    const modifiedCmsdStaticValue = cmsdStaticValue.replace(/\\"/g, '"');
    const cmsdStaticObject = {};
    modifiedCmsdStaticValue.split(",").forEach((pair) => {
      const [key, value] = pair.split("=");
      cmsdStaticObject[key] = value;
    });

    console.log(cmsdStaticObject);
    // validate each key in the cmsdStaticObject
    Object.keys(cmsdStaticObject).forEach((key) => {
      if (!validateKeyValue(key, cmsdStaticObject[key])) {
        results.push({
          status: "error",
          key: key,
          value: cmsdStaticObject[key],
          type: "static",
        });
        console.log(
          "Invalid key-value pair: " + key + "=" + cmsdStaticObject[key]
        );
      } else {
        results.push({
          valid: false,
          key: key,
          value: cmsdStaticObject[key],
          type: "static",
        });
      }
    });
    return results;
  } catch (e) {
    console.log("Invalid header");
    return false;
  }
};
