//
//  FileManager.swift
//  PocketCards
//
//  Created by macmini on 2022/04/28.
//

import Foundation
import SwiftUI

extension FileManager {
    func directoryUrl() -> URL? {
        let paths = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)
        return paths.first
    }

    func allRecordedData() -> [URL]? {
        if let documentsUrl = directoryUrl() {
            do {
                let directoryContents = try FileManager.default.contentsOfDirectory(at: documentsUrl, includingPropertiesForKeys: nil)

                debugPrint(directoryContents)

                return directoryContents
            } catch {
                return nil
            }
        }
        return nil
    }

    func getFileUrl(fileName: String?) -> URL? {
        // nil check
        guard let fileURL = fileName else { return nil }
        // empty check
        if fileURL.isEmpty { return nil }

        let documentsUrl = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]

        return documentsUrl.appendingPathComponent(fileURL)
    }

    func loadImage(fileName: String) -> UIImage? {
        Task {
            debugPrint(111)
            if !fileExists(fileName: fileName) {
                debugPrint(222)
//                DownloadManager.default.downloadFile(path: fileName)
                let request = DownloadManager.default.downloadRequest(path: fileName)

                _ = await request?.serializingDownloadedFileURL().response

                debugPrint(333)
//                _ = await DownloadManager.default.downloadRequest(path: fileName)?.response
            }
        }

        let url = getFileUrl(fileName: fileName)
        guard let fileURL = url else { return nil }

        do {
            let imageData = try Data(contentsOf: fileURL)
            return UIImage(data: imageData)
        } catch {}

        return nil
    }

    func fileExists(fileName: String) -> Bool {
        let destinationUrl = directoryUrl()?.appendingPathComponent(fileName)

        if let destinationUrl = destinationUrl {
            if FileManager().fileExists(atPath: destinationUrl.path) {
                return true
            }
        }

        return false
    }
}
