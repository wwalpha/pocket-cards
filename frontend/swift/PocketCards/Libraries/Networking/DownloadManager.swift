//
//  DownloadManager.swift
//  PocketCards
//
//  Created by macmini on 2022/04/28.
//
import Alamofire
import Foundation

class DownloadManager {
    public static var `default` = DownloadManager()
    private var manager = FileManager.default
    private var docsUrl = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first

    func downloadRequest(path: String?) -> DownloadRequest? {
        // validation
        guard let filepath = path else { return nil }

        // validation
        if filepath.isEmpty {
            return nil
        }

        // file exist
        if fileExists(filepath: filepath) {
            return nil
        }

        // download
        let destination: DownloadRequest.Destination = { _, _ in
            let documentsURL = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
            let fileURL = documentsURL.appendingPathComponent(filepath)

            return (fileURL, [.removePreviousFile, .createIntermediateDirectories])
        }

        return AF.download(DOMAIN_HOST + filepath, to: destination)
    }

    func downloadFile(path: String?) {
        let request = downloadRequest(path: path)

        _ = request?.serializingDownloadedFileURL()
    }

    private func fileExists(filepath: String) -> Bool {
        let destinationUrl = docsUrl?.appendingPathComponent(filepath)

        if let destinationUrl = destinationUrl {
            if FileManager().fileExists(atPath: destinationUrl.path) {
                return true
            }
        }

        return false
    }

    private func folderExists(folder: String) {
        if folder.isEmpty { return }

        guard let dir = docsUrl?.appendingPathComponent(folder) else { return }
        var isDir: ObjCBool = true

        // folder exist
        if manager.fileExists(atPath: dir.path, isDirectory: &isDir) {
            return
        }

        // create folder
        try? manager.createDirectory(at: dir, withIntermediateDirectories: true, attributes: nil)
    }
}
